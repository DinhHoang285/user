import { buildUrl } from '@lib/string';
import { APIRequest } from './api-request';

export class ReferralService extends APIRequest {
  getReferralCode() {
    return this.get('/referrals/user/code');
  }

  search(query?: { [key: string]: any }) {
    return this.get(
      buildUrl('/referrals/user/search', query)
    );
  }
}

export const referralService = new ReferralService();
