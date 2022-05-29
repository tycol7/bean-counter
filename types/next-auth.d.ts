/* eslint-disable no-unused-vars */
import NextAuth from 'next-auth';
import {JWT} from 'next-auth/jwt';

declare module 'next-auth' {
    interface User {
        id: number
        name: string
        email: string
        image: string
        admin: boolean
    }
    interface Session {
        user: User
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        user: User
    }
}
