import { buildUrl } from '@lib/string';
import { APIRequest } from './api-request';

class BannerService extends APIRequest {
  search(query: any) {
    return this.get(buildUrl('/site-promo/search', query));
  }
}

export const bannerService = new BannerService();
