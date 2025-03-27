import { buildUrl } from '@lib/string';
import { APIRequest } from './api-request';

export class VaultService extends APIRequest {
  search(query?: { [key: string]: any }) {
    return this.get(
      buildUrl('/vaults/search', query)
    );
  }

  delete(id: string) {
    return this.del(`/vaults/delete/${id}`);
  }

  findOne(id: string) {
    return this.get(`/vaults/${id}/view`);
  }

  uploadPhoto(file: File, payload: any, onProgress?: Function) {
    return this.upload(
      '/vaults/photo/upload',
      [
        {
          fieldname: 'file',
          file
        }
      ],
      {
        onProgress,
        customData: payload
      }
    );
  }

  uploadVideo(file: File, payload: any, onProgress?: Function) {
    return this.upload(
      '/vaults/video/upload',
      [
        {
          fieldname: 'file',
          file
        }
      ],
      {
        onProgress,
        customData: payload
      }
    );
  }
}

export const vaultService = new VaultService();
