import { APIRequest } from './api-request';

export class TwitterService extends APIRequest {
  getAccount() {
    return this.get('/twitter/account');
  }

  getLinkAuthoration() {
    return this.get('/twitter/getLink');
  }

  verify(payload) {
    return this.post('/twitter/verify', payload);
  }

  unLinkAuthoration() {
    return this.del('/twitter/unlink');
  }
}

export const twitterService = new TwitterService();
