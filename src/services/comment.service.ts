import { buildUrl } from '@lib/string';
import { APIRequest } from './api-request';

class CommentService extends APIRequest {
  create(payload: any) {
    return this.post('/comments', payload);
  }

  update(id: string, payload: any) {
    return this.upload(`/comments/${id}`, payload);
  }

  search(query?: { [key: string]: any }) {
    return this.get(buildUrl('/comments', query));
  }

  delete(id: string) {
    return this.del(`/comments/${id}`);
  }
}

export const commentService = new CommentService();
