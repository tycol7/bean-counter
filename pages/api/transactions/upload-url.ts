/* eslint-disable require-jsdoc */
/* https://github.com/leerob/nextjs-gcp-storage/blob/main/pages/api/upload-url.js */

import {Storage} from '@google-cloud/storage';
import type {NextApiRequest, NextApiResponse} from 'next';

export default async function handler(req: NextApiRequest,
    res: NextApiResponse) {
  const storage = new Storage({
    projectId: process.env.GOOGLE_PROJECT_ID,
    credentials: {
      client_email: process.env.CLIENT_EMAIL,
      private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
  });

  const bucket = storage.bucket(process.env.BUCKET_NAME);
  const file = bucket.file(req.query.file as string);
  const options = {
    expires: Date.now() + 1 * 60 * 1000, //  1 minute,
    fields: {'x-goog-meta-test': 'data'},
  };

  const [response] = await file.generateSignedPostPolicyV4(options);
  res.status(200).json(response);
}
