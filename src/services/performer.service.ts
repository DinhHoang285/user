import { IPerformer } from 'src/interfaces';
import md5 from 'md5';
import { buildUrl } from '@lib/string';
import { APIRequest, IResponse } from './api-request';

export class PerformerService extends APIRequest {
  search(query?: { [key: string]: any }) {
    return this.get(buildUrl('/performers/user/search', query));
  }

  searchUrl() {
    return '/performers/user/search';
  }

  randomSearch(query?: { [key: string]: any }) {
    return this.get(buildUrl('/performers/search/random', query));
  }

  randomSearchUrl() {
    return '/performers/search/random';
  }

  me(headers?: { [key: string]: string }): Promise<IResponse<IPerformer>> {
    return this.get('/performers/me', headers);
  }

  findOne(id: string, headers?: { [key: string]: string }) {
    return this.get(`/performers/${id}`, headers);
  }

  uploadAvatar(file: File, payload?: any, onProgress?: Function) {
    return this.upload(
      '/performers/avatar/upload',
      [
        {
          fieldname: 'avatar',
          file
        }
      ],
      {
        onProgress,
        customData: payload
      }
    );
  }

  uploadCover(file: File, payload?: any, onProgress?: Function) {
    return this.upload(
      '/performers/cover/upload',
      [
        {
          fieldname: 'cover',
          file
        }
      ],
      {
        onProgress,
        customData: payload
      }
    );
  }

  getAvatarUploadUrl() {
    const endpoint = this.getBaseApiEndpoint();
    return new URL('/performers/avatar/upload', endpoint).href;
  }

  getCoverUploadUrl() {
    const endpoint = this.getBaseApiEndpoint();
    return new URL('/performers/cover/upload', endpoint).href;
  }

  getVideoUploadUrl() {
    const endpoint = this.getBaseApiEndpoint();
    return new URL('/performers/welcome-video/upload', endpoint).href;
  }

  getDocumentUploadUrl() {
    const endpoint = this.getBaseApiEndpoint();
    return new URL('/performers/documents/upload', endpoint).href;
  }

  updateMe(id: string, payload: any) {
    let password: '';
    if (payload.password) {
      password = process.env.HASH_PW_CLIENT === 'true' ? md5(payload.password) : payload.password;
    }
    return this.put(`/performers/${id}`, { ...payload, password });
  }

  getTopPerformer(query?: { [key: string]: any }) {
    return this.get(buildUrl('/performers/top', query));
  }

  updateBanking(id: string, payload) {
    return this.put(`/performers/${id}/banking-settings`, payload);
  }

  updatePaymentGateway(id, payload) {
    return this.put(`/performers/${id}/payment-gateway-settings`, payload);
  }

  getBookmarked(payload) {
    return this.get(buildUrl('/reactions/performers/bookmark', payload));
  }

  uploadDocuments(documents: {
    file: File;
    fieldname: string;
  }[], onProgress?: Function) {
    return this.upload('/performers/documents/upload', documents, {
      onProgress
    });
  }

  updateSocialLink(payload) {
    return this.put('/performers/update/socials-link', payload);
  }

  unLinkSocial(socialName) {
    return this.del(`/performers/unlink-social/${socialName}`);
  }
}

export const performerService = new PerformerService();
