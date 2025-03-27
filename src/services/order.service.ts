import { buildUrl } from '@lib/string';
import { APIRequest } from './api-request';

class OrderService extends APIRequest {
  performerSearch(payload) {
    return this.get(buildUrl('/orders/search', payload));
  }

  performerSearchUrl() {
    return '/orders/search';
  }

  userSearchUrl() {
    return '/orders/users/search';
  }

  userSearch(payload) {
    return this.get(buildUrl('/orders/users/search', payload));
  }

  findById(id: string, headers = {}) {
    return this.get(`/orders/${id}`, headers);
  }

  update(id, data) {
    return this.put(`/orders/${id}/update`, data);
  }

  updateDeliveryAddress(id, data) {
    return this.put(`/orders/${id}/update/delivery-address`, data);
  }

  getDownloadLinkDigital(productId: string) {
    return this.get(`/performer-assets/products/${productId}/download-link`);
  }
}

export const orderService = new OrderService();
