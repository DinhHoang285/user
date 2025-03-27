import { buildUrl } from '@lib/string';
import { APIRequest } from './api-request';

class CollectionService extends APIRequest {
  searchByIdPerformer(id: string, query?: { [key: string]: any }) {
    return this.get(buildUrl(`/collection/${id}`, query));
  }
}

export const collectionService = new CollectionService();
