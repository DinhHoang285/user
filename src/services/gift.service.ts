import { buildUrl } from '@lib/string';
import { APIRequest } from './api-request';

export class GiftService extends APIRequest {
  search(query?: { [key: string]: any }) {
    return this.get(
      buildUrl('/gifts/search', query)
    );
  }
}

export const giftService = new GiftService();
