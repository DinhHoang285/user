import NextAuth, { DefaultSession } from 'next-auth';
import { IUser } from 'src/interfaces';
import { authOptions } from '@lib/auth';

declare module 'next-auth' {
  interface User extends IUser {
    token: string;
  }

  interface Session extends DefaultSession {
    accessToken: string;
    user: any;
  }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
