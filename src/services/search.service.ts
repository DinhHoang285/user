import { buildUrl } from '@lib/string';
import { APIRequest } from './api-request';

class SearchService extends APIRequest {
  searchByKeyword(payload) {
    return this.post('/search/keywords', payload);
  }

  listByKeyword(query?: { [key: string]: any }) {
    return this.get(
      buildUrl('/search/list/keywords', query)
    );
  }
}

export const searchService = new SearchService();
