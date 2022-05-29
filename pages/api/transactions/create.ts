/* eslint-disable require-jsdoc */
/* https://github.com/leerob/nextjs-gcp-storage/blob/main/pages/api/upload-url.js */
/* How to upload files in Next.js: https://flaviocopes.com/nextjs-upload-files/ */

import type {NextApiRequest, NextApiResponse} from 'next';
import middleware from './middleware';
import nextConnect from 'next-connect';
import {Storage} from '@google-cloud/storage';
import FormData from 'form-data';
import fs from 'fs';
import {getSession} from 'next-auth/react';
import {prisma} from '../../db';
import {TransactionType} from '@prisma/client';

const handler = nextConnect();
handler.use(middleware);

type FormFields = {
  description: string[]
  date: string[]
  amount: string[]
  type: TransactionType[]
}

type FileUpload = {
  fieldName: string
  originalFilename: string
  path: string
  size: number
}

handler.post(async (req: NextApiRequest,
    res: NextApiResponse) => {
  const session = await getSession({req});
  const fields: FormFields = req.body;
  const upload: FileUpload = (req as any).files.attachment[0];

  if (!session) {
    res.status(401); // unauthorized
    return;
  }

  /* Only upload to cloud if attachment exists */
  let attachmentName = null;
  if (upload.size > 0) {
    /* Authenticate to Google Cloud */
    const storage = new Storage({
      projectId: process.env.GOOGLE_PROJECT_ID,
      credentials: {
        client_email: process.env.CLIENT_EMAIL,
        private_key: process.env.PRIVATE_KEY,
      },
    });
    const bucket = storage.bucket(process.env.BUCKET_NAME);
    const file = bucket.file(upload.originalFilename);

    const authOptions = {
      expires: Date.now() + 1 * 60 * 1000, // 1 minute
      fields: {'x-goog-meta-test': 'data'},
    };
    const [authResponse] = await file.generateSignedPostPolicyV4(authOptions);

    /* Upload file to Google Cloud and get the URL */
    const formData = new FormData();
    Object.entries({...authResponse.fields}).forEach(([key, value]) => {
      formData.append(key, value);
    });

    formData.append('file', fs.createReadStream(upload.path));

    const uploadOptions = {
      method: 'POST',
      body: formData,
    };

    await fetch(authResponse.url, uploadOptions as any);
    attachmentName = upload.originalFilename;
  }

  /* Save the transaction to the database */
  const transaction = {
    transactionDate: new Date(fields.date[0]),
    description: fields.description[0],
    amount: parseFloat(fields.amount[0]),
    type: fields.type[0],
    attachment: attachmentName,
    userId: session.user.id,
  };

  await prisma.transaction.create({
    data: transaction,
  });

  res.status(200).json({
    data: transaction,
  });
  res.end();
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
