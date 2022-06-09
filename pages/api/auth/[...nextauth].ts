/* eslint-disable new-cap */
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import {prisma} from '../../../lib/db';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || '',
      clientSecret: process.env.GOOGLE_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Guest',
      credentials: {},
      async authorize() {
        return {id: 4, name: 'Guest Account', email: 'guest@example.com',
          image: '/guest.png', role: 'GUEST'};
      },
    }),
  ],
  callbacks: {
    async signIn({user}) {
      const getUser = await prisma.user.findUnique({
        where: {
          email: user.email,
        },
        select: {
          id: true,
          email: true,
          role: true,
        },
      });
      if (getUser) {
        user.role = getUser.role;
        user.id = getUser.id;
        return true;
      }
      return false;
    },
    async jwt({token, user}) {
      user && (token.user = user);
      return token;
    },
    async session({session, token}) {
      session.accessToken = token.accessToken;
      session.user = token.user;
      return session;
    },
  },
  events: {
    async signIn({user}) {
      // eslint-disable-next-line no-unused-vars
      const updateUser = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          lastLogin: new Date(),
        },
      });
    },
  },
  pages: {
    signIn: '/signin',
    error: '/error',
  },
});
