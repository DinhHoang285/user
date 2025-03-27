import { buildUrl } from '@lib/string';
import { APIRequest } from './api-request';

class ScheduleService extends APIRequest {
  editSchedule(payload: any, id: string) {
    return this.post(`/schedule/edit/${id}`, payload);
  }

  searchByPerformer(id) {
    return this.get(buildUrl(`/schedule/${id}`));
  }
}

export const scheduleService = new ScheduleService();
