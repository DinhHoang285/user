import md5 from 'md5';
import { buildUrl } from '@lib/string';
import { APIRequest } from './api-request';

class UserService extends APIRequest {
  me(headers?: { [key: string]: string }): Promise<any> {
    return this.get('/users/me', headers);
  }

  updateMe(payload: any) {
    let password: '';
    if (payload.password) {
      password = process.env.HASH_PW_CLIENT === 'true' ? md5(payload.password) : payload.password;
    }

    return this.put('/users', { ...payload, password });
  }

  getAvatarUploadUrl(userId?: string) {
    const endpoint = this.getBaseApiEndpoint();
    if (userId) {
      return new URL(`/users/${userId}/avatar/upload`, endpoint).href;
    }
    return new URL('/users/avatar/upload', endpoint).href;
  }

  search(query?: { [key: string]: any }) {
    return this.get(buildUrl('/users/search', query));
  }

  findById(id: string) {
    return this.get(`/users/view/${id}`);
  }
}

export const userService = new UserService();
