import { buildUrl } from '@lib/string';
import { APIRequest } from './api-request';

export class PhotoService extends APIRequest {
  searchByUser(query?: { [key: string]: any }) {
    const { performerId } = query;
    return this.get(
      buildUrl(`/performer-assets/photos/${performerId}`, query)
    );
  }

  searchByPerformer(query?: { [key: string]: any }) {
    return this.get(
      buildUrl('/performer/performer-assets/photos/search', query)
    );
  }

  update(id: string, payload: any) {
    return this.put(`/performer/performer-assets/photos/${id}`, payload);
  }

  setCoverGallery(id: string) {
    return this.post(`/performer/performer-assets/photos/set-cover/${id}`);
  }

  delete(id: string) {
    return this.del(`/performer/performer-assets/photos/${id}`);
  }

  uploadImages(file: File, payload: any, onProgress?: Function) {
    return this.upload(
      '/performer/performer-assets/photos/upload',
      [
        {
          fieldname: 'photo',
          file
        }
      ],
      {
        onProgress,
        customData: payload
      }
    );
  }

  userSearch(payload: any, headers?: any) {
    return this.get(buildUrl('/performer-assets/photos', payload), headers);
  }

  uploadImagesByVault(payload: any) {
    return this.post('/performer/performer-assets/photos/create', payload);
  }

  searchPhotosInGallery(payload) {
    return this.get(buildUrl('/performer/performer-assets/photos/search', payload));
  }
}

export const photoService = new PhotoService();
