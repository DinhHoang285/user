import { buildUrl } from '@lib/string';
import { APIRequest } from './api-request';

export class TokenTransactionService extends APIRequest {
  sendTip(performerId: string, payload: any) {
    return this.post(`/wallet/charges/tip/${performerId}`, payload);
  }

  purchaseFeed(id, payload) {
    return this.post(`/wallet/charges/feed/${id}`, payload);
  }

  purchaseMessage(id, payload) {
    return this.post(`/wallet/charges/message/${id}`, payload);
  }

  userSearch(query?: { [key: string]: any }) {
    return this.get(buildUrl('/wallet/charges/search', query));
  }

  getListPerformer(id, query: { [key: string]: any }) {
    return this.get(buildUrl(`/wallet/charges/search/list-performer/${id}`, query));
  }

  sendGift(giftId: string, payload: any) {
    return this.post(`/wallet/charges/gift/${giftId}`, payload);
  }
}

export const tokenTransactionService = new TokenTransactionService();
