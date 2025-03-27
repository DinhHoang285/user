import { buildUrl } from '@lib/string';
import { APIRequest } from './api-request';

export class ExploreService extends APIRequest {
  search(query?: { [key: string]: any }) {
    return this.get(buildUrl('/explore', query));
  }
}

export const exploreService = new ExploreService();
