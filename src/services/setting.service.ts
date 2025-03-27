import { ISettings } from '@interfaces/setting';
import { buildUrl } from '@lib/string';
import { APIRequest, IResponse } from './api-request';

export class SettingService extends APIRequest {
  async all() {
    const { data } = await this.get(buildUrl('/settings/public'));
    return data;
  }

  getGroup(group = ''): Promise<IResponse<ISettings>> {
    return this.get(buildUrl('/settings/group', { group }));
  }

  contact(data) {
    return this.post('/contact', data);
  }

  async valueByKeys(keys: string[]): Promise<Record<string, any>> {
    const { data } = await this.post('/settings/keys', { keys });
    return data;
  }
}

export const settingService = new SettingService();
