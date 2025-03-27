import { APIRequest } from './api-request';

export class FileService extends APIRequest {
  getFileStatus(fileId: string, query: Record<string, any>) {
    return this.get(`/files/${fileId}/status`, query);
  }
}

export const fileService = new FileService();
