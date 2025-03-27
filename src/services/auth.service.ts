import cookie from 'js-cookie';
import {
  IFanRegister, IForgot, ILogin, IVerifyEmail
} from 'src/interfaces';
import md5 from 'md5';
import { signOut } from 'next-auth/react';
import { APIRequest, TOKEN } from './api-request';

export class AuthService extends APIRequest {
  login(data: ILogin) {
    // hashm5 password
    const password = process.env.HASH_PW_CLIENT === 'true' ? md5(data.password) : data.password;

    return this.post('/auth/login', {
      ...data,
      password
    });
  }

  loginTwitter(options) {
    return this.post('/auth/twitter/login', options);
  }

  loginGoogle(data: any) {
    return this.post('/auth/google/login', data);
  }

  getTokenGoogle(data: any) {
    return this.post('/auth/google/token', data);
  }

  callbackLoginTwitter(data) {
    return this.post('/auth/twitter/callback', data);
  }

  verifyEmail(data: IVerifyEmail) {
    return this.post('/auth/email-verification', data);
  }

  setToken(token: string, remember = true): void {
    const expired = { expires: !remember ? 1 : 365 };
    cookie.set(TOKEN, token, expired);
  }

  getToken(): string {
    return cookie.get(TOKEN);
  }

  setTwitterToken(data: any, role: string) {
    cookie.set('oauthToken', data.oauthToken, { expires: 1 });
    cookie.set('oauthTokenSecret', data.oauthTokenSecret, { expires: 1 });
    cookie.set('twCallbackUrl', data.callbackUrl, { expires: 1 });
    cookie.set('role', role, { expires: 1 });
  }

  getTwitterToken() {
    const oauthToken = cookie.get('oauthToken');
    const oauthTokenSecret = cookie.get('oauthTokenSecret');
    const callbackUrl = cookie.get('twCallbackUrl');
    const role = cookie.get('role');
    return {
      oauthToken, oauthTokenSecret, callbackUrl, role
    };
  }

  clearTwitterToken() {
    cookie.remove('oauthToken');
    cookie.remove('oauthTokenSecret');
    cookie.remove('twCallbackUrl');
    cookie.remove('role');
  }

  removeToken(): void {
    cookie.remove(TOKEN);
  }

  updatePassword(pw: string, source?: string) {
    const password = process.env.HASH_PW_CLIENT === 'true' ? md5(pw) : pw;
    return this.put('/auth/users/me/password', { password, source });
  }

  resetPassword(data: IForgot) {
    return this.post('/auth/users/forgot', data);
  }

  register(data: IFanRegister) {
    const password = process.env.HASH_PW_CLIENT === 'true' ? md5(data.password) : data.password;

    return this.post('/auth/users/register', { ...data, password });
  }

  registerPerformer(documents: {
    file: File;
    fieldname: string;
  }[], data: any, onProgress?: Function) {
    const password = process.env.HASH_PW_CLIENT === 'true' ? md5(data.password) : data.password;
    return this.upload('/auth/performers/register', documents, {
      onProgress,
      customData: { ...data, password }
    });
  }

  checkCodeLogin(payload: any) {
    return this.post('/auth/verify-code/login', payload);
  }
}

export const authService = new AuthService();
