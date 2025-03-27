import { buildUrl } from '@lib/string';
import { APIRequest } from './api-request';

class ShippingAddressService extends APIRequest {
  create(
    payload: any
  ) {
    return this.post('/addresses/create', payload);
  }

  update(id: string, payload: any) {
    return this.upload(`/addresses/${id}`, payload);
  }

  search(query?: { [key: string]: any }) {
    return this.get(
      buildUrl('/addresses/search', query)
    );
  }

  delete(id: string) {
    return this.del(`/addresses/${id}`);
  }
}

export const shippingAddressService = new ShippingAddressService();
