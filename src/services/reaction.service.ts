import { buildUrl } from '@lib/string';
import { APIRequest } from './api-request';

export class ReactionService extends APIRequest {
  create(payload: any) {
    return this.post('/reactions', payload);
  }

  delete(payload: any) {
    return this.del('/reactions', payload);
  }

  getBookmarks(payload) {
    return this.get(buildUrl('/reactions/bookmark', payload));
  }
}

export const reactionService = new ReactionService();
