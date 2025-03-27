import { buildUrl } from '@lib/string';
import { APIRequest } from './api-request';

class BlockService extends APIRequest {
  blockCountries(payload: any) {
    return this.post('/block/countries', payload);
  }

  blockUser(payload: any) {
    return this.post('/block/users', payload);
  }

  unBlockUser(id: string) {
    this.del(`/block/users/${id}`);
  }

  getBlockListUsers(query: any) {
    return this.get(buildUrl('/block/users', query));
  }

  performerBlockUrl() {
    return '/block/users';
  }

  checkCountryBlock(headers = {}) {
    return this.get('/block/countries/check?fromServerRequest=true', headers);
  }
}

export const blockService = new BlockService();
