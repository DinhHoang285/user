import { buildUrl } from '@lib/string';
import { APIRequest } from './api-request';

class TokenPackageService extends APIRequest {
  search(query) {
    return this.get(buildUrl('/package/token/search', query as any));
  }
}

export const tokenPackageService = new TokenPackageService();
