import { buildUrl } from '@lib/string';
import { APIRequest } from './api-request';

export class EarningService extends APIRequest {
  performerStarts(param?: any) {
    return this.get(buildUrl('/performer/earning/stats', param));
  }

  performerStasListing(param?: any) {
    return this.get(buildUrl('/performer/earning/stats/listing', param));
  }

  performerSearch(param?: any) {
    return this.get(buildUrl('/performer/earning/search', param));
  }

  performerExport() {
    return buildUrl(`${process.env.API_ENDPOINT}/performer/earning/export/csv`);
  }

  referralStats() {
    return this.get('/referral-earnings/stats');
  }

  referralSearch(query?: { [key: string]: any }) {
    return this.get(buildUrl('/referral-earnings/search', query));
  }
}

export const earningService = new EarningService();
