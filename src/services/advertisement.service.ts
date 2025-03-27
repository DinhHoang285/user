import { APIRequest } from './api-request';

export class AdvertisementService extends APIRequest {
  performerSearch(query?: { [key: string]: any }) {
    const queryString = query ? `?${new URLSearchParams(query).toString()}` : '';
    return this.get(`/performer/advertisement/search${queryString}`);
  }

  getProfileBanner(id: string, query?: { [key: string]: any }) {
    const queryString = query ? `?${new URLSearchParams(query).toString()}` : '';
    return this.get(`/advertisement/profile/${id}${queryString}`);
  }

  findOne(id: string, headers?: { [key: string]: string }) {
    return this.get(`/advertisement/${id}`, headers);
  }

  views(id: string) {
    return this.post(`/user/feeds/view/${id}`);
  }

  update(
    id: string,
    files: [{ fieldname: string; file: File }],
    payload: any,
    onProgress?: Function
  ) {
    return this.upload(`/performer/advertisement/edit/${id}`, files, {
      onProgress,
      customData: payload,
      method: 'PUT'
    });
  }

  create(
    files: [{ fieldname: string; file: File }],
    payload: any,
    onProgress?: Function
  ) {
    return this.upload('/performer/advertisement/upload', files, {
      onProgress,
      customData: payload
    });
  }

  delete(id: string) {
    return this.del(`/performer/advertisement/${id}`);
  }

  deleteFile(id: string, type: string) {
    return this.del(`/performer/advertisement/remove-file/${id}`, { type });
  }
}

export const advertisementService = new AdvertisementService();
