/* eslint-disable require-jsdoc */
/* https://github.com/leerob/nextjs-gcp-storage/blob/main/pages/api/upload-url.js */
/* How to upload files in Next.js: https://flaviocopes.com/nextjs-upload-files/ */

import type {NextApiRequest, NextApiResponse} from 'next';
import {prisma} from '../../../lib/db';
import {TransactionType} from '@prisma/client';
import {getSession} from 'next-auth/react';

type FormFields = {
  description: string
  date: string
  amount: string
  type: TransactionType
  fileName: string
}

export default async function handler(req: NextApiRequest,
    res: NextApiResponse) {
  const session = await getSession({req});
  if (session) {
    const fields: FormFields = req.body;
    /* Save the transaction to the database */
    const transaction = {
      transactionDate: new Date(fields.date),
      description: fields.description,
      amount: parseFloat(fields.amount),
      type: fields.type,
      attachment: fields.fileName || '',
      userId: session.user.id,
    };

    await prisma.transaction.create({
      data: transaction,
    });

    res.status(200).json({
      data: transaction,
    });
  } else {
    res.status(401); // Unauthorized
  }
  res.end();
}
