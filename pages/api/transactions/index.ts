/* eslint-disable require-jsdoc */
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next';
import {getSession} from 'next-auth/react';
import {prisma} from '../../../lib/db';

export default async function handler(req: NextApiRequest,
    res: NextApiResponse) {
  const session = await getSession({req});
  if (session) {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        transactionDate: true,
        description: true,
        amount: true,
        type: true,
        attachment: true,
      },
      orderBy: {
        transactionDate: 'desc',
      },
    });
    let balance = 0;
    for (const transaction of transactions) {
      if (transaction.type === 'CREDIT') {
        balance -= transaction.amount;
      } else {
        balance += transaction.amount;
      }
    }
    res.json([balance, transactions]);
  } else {
    res.status(401); // Unauthorized
  }
  res.end();
}
