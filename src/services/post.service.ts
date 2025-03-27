import { IPostSearch } from 'src/interfaces';

import { buildUrl } from '@lib/string';
import { APIRequest } from './api-request';

class PostService extends APIRequest {
  search(query: IPostSearch) {
    return this.get(buildUrl('/posts/search', query as any));
  }

  findById(id: string) {
    return this.get(`/posts/${id}`);
  }
}

export const postService = new PostService();
