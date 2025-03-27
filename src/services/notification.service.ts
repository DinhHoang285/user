import { buildUrl } from '@lib/string';
import { APIRequest } from './api-request';

class NotificationService extends APIRequest {
  public static HOLDER_IDS = [] as any[];

  search(query) {
    return this.get(buildUrl('/notification', query));
  }

  countUnread(headers?: { [key: string]: string }) {
    return this.get('/notification/total-unread', headers);
  }

  readAll() {
    return this.put('/notification/read-all');
  }

  read(id: string) {
    return this.put(`/notification/${id}/read`);
  }

  hasHolderId(id) {
    return NotificationService.HOLDER_IDS.includes(id);
  }

  addHolderId(id) {
    NotificationService.HOLDER_IDS.push(id);
  }
}

export const notificationService = new NotificationService();
