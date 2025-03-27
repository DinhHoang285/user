import { buildUrl } from '@lib/string';
import { APIRequest } from './api-request';

export class FeaturedService extends APIRequest {
  getFeaturedFeed(query?: { [key: string]: any }) {
    return this.get(
      buildUrl('/featured/feed', query)
    );
  }
}

export const featuredService = new FeaturedService();
