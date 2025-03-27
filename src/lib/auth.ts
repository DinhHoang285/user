/* eslint-disable no-param-reassign */
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { cookies } from 'next/headers';
import { userService } from '@services/user.service';
import md5 from 'md5';
import { TOKEN } from '@services/api-request';
import { messageService } from '@services/message.service';
import { notificationService } from '@services/notification.service';
import { getResponseError } from './utils';
import { buildUrl } from './string';

const moment = require('moment');
const axios = require('axios');

const maxAge = 60 * 60 * 24 * 90; // 90d

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: 'Credentials',
      type: 'credentials',
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'Username' },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'Password'
        }
      },
      async authorize(credentials: any) {
        const cookieStore = await cookies();
        if (credentials.token) {
          try {
            const { data: user } = await userService.me({ Authorization: credentials.token });
            cookieStore.set(TOKEN, credentials.token, { httpOnly: false, maxAge });

            return {
              ...user,
              token: credentials.token
            };
          } catch (e) {
            throw new Error(e);
          }
        }
        let endpoint = `${process.env.API_ENDPOINT}/auth/login`;
        let method = 'POST';

        const password = credentials?.password && (process.env.HASH_PW_CLIENT === 'true' ? md5(credentials.password) : credentials.password);
        let body = JSON.stringify({ ...credentials, password });

        switch (credentials.type) {
          case 'google': endpoint = `${process.env.API_ENDPOINT}/auth/google/token`;
            break;
          case 'google-onetap': endpoint = `${process.env.API_ENDPOINT}/auth/google/login`;
            break;
          case 'twitter':
            endpoint = buildUrl(`${process.env.API_ENDPOINT}/auth/twitter/callback`, credentials);
            method = 'GET';
            body = null;
            break;
          default: break;
        }
        try {
          const resp = await axios({
            method,
            url: endpoint,
            data: body,
            headers: { 'Content-Type': 'application/json' }
          });

          if (!resp?.data.data) {
            throw new Error(getResponseError(resp.message));
          }

          if (!resp.data.data?.token) {
            return {
              ...resp.data.data,
              token: resp.data.data.token,
              email: resp.data.data.email,
              enable2StepEmail: resp.data.data.enable2StepEmail,
              sendCode: resp.data.data.sendCode
            };
          }

          const { data: user } = await userService.me({ Authorization: resp.data.data.token });
          cookieStore.set('token', resp.data.data.token, { httpOnly: false, maxAge });

          return {
            ...user,
            token: resp.data.data.token,
            email: user.email,
            enable2StepEmail: user.enable2StepEmail
          };
        } catch (e) {
          throw new Error(e?.response?.data?.message);
        }
      }
    })
  ],
  session: { strategy: 'jwt', maxAge },
  callbacks: {
    signIn: ({ user }) => {
      if (user.token) return true;
      if (user.sendCode) {
        throw new Error(JSON.stringify({
          message: '2-step verification required',
          email: user.email,
          enable2StepEmail: user.enable2StepEmail,
          sendCode: user.sendCode
        }));
      }
      return false;
    },
    jwt({
      token, user, trigger, session
    }) {
      if (user && user.token) {
        token.accessToken = user.token;
        if (user.token) {
          delete user.token;
        }
        token.user = user;
      }
      // update profile
      if (trigger === 'update') {
        token.user = { ...session.user, ...session.info };
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        if (moment(session.expires).isBefore(moment())) return null;
        session.accessToken = token.accessToken as string;
        const [{ data: messageCount }, { data: notificationCount }] = await Promise.all([
          messageService.countTotalNotRead({ Authorization: token.accessToken as any }),
          notificationService.countUnread({ Authorization: token.accessToken as any })
        ]);

        session.user = {
          ...token.user as any,
          unreadMessage: messageCount?.total || 0,
          unreadNotification: notificationCount || 0
        };
        return session;
      }
      // If the DB user doesn't exist anymore (ie. user was deleted)
      // -- revoke the session (aka. return null). Unfortunately next-auth
      // doesn't support returning null here to revoke a session. It throws
      // an error instead. :(
      return null;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || '123123'
};
