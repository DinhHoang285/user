import { buildUrl } from '@lib/string';
import { APIRequest } from './api-request';

class SubscriptionService extends APIRequest {
  search(query?: { [key: string]: any }) {
    return this.get(buildUrl('/subscriptions/performer/search', query));
  }

  performerSearchUrl() {
    return '/subscriptions/performer/search';
  }

  userSearch(query?: { [key: string]: any }) {
    return this.get(buildUrl('/subscriptions/user/search', query));
  }

  cancelSubscription(id: string, gateway: string) {
    return this.post(`/payment/${gateway}/cancel-subscription/${id}`);
  }
}
export const subscriptionService = new SubscriptionService();
