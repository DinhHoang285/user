import { buildUrl } from '@lib/string';
import { APIRequest } from './api-request';

export class AnalyticsService extends APIRequest {
  getAnalyticsGrowth(query?: any) {
    return this.get(buildUrl('/analytics/growth', query));
  }

  getAnalyticsTopSales(query?: any) {
    return this.get(buildUrl('/analytics/top-sales', query));
  }

  getAnalyticsTopSpend(query?: any) {
    return this.get(buildUrl('/analytics/top-spend', query));
  }

  getAnalyticsTopSubbed(query?: any) {
    return this.get(buildUrl('/analytics/top-sub', query));
  }

  getAnalyticsPercentage(query?: any) {
    return this.get(buildUrl('/analytics/percentage', query));
  }

  getAnalyticsPercentageByModule(query?: any) {
    return this.get(buildUrl('/analytics/percentage/by-module', query));
  }
}

export const analyticsService = new AnalyticsService();
