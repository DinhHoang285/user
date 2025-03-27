import { APIRequest } from './api-request';

class RequestService extends APIRequest {
  createRequest(payload, type) {
    return this.post(`/request/create/${type}`, payload);
  }
}

export const requestService = new RequestService();
