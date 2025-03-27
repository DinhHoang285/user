import { isUrl } from '@lib/string';
import cookie from 'js-cookie';

const axios = require('axios');

export interface IResponse<T> {
  status: number;
  data: T;
}

export const TOKEN = 'token';

export abstract class APIRequest {
  static API_ENDPOINT: string = null;

  getBaseApiEndpoint() {
    const { API_ENDPOINT } = APIRequest;
    if (API_ENDPOINT) return API_ENDPOINT;

    return process.env.API_ENDPOINT;
  }

  request(
    url: string,
    method?: string,
    body?: any,
    headers?: { [key: string]: string }
  ): Promise<IResponse<any>> {
    const verb = (method || 'get').toUpperCase();
    const updatedHeader = {
      'Content-Type': 'application/json',
      Authorization: cookie.get(TOKEN) || null,
      ...(headers || {})
    };
    const baseApiEndpoint = headers?.baseEndpoint || this.getBaseApiEndpoint();

    return axios(isUrl(url) ? url : `${baseApiEndpoint}${url}`, {
      method: verb,
      headers: updatedHeader,
      data: body ? JSON.stringify(body) : undefined
    })
      .then((resp) => resp.data)
      .catch((error) => {
        const { response } = error;
        if (response && response.status === 401) {
          if (typeof window !== 'undefined') {
            window.location.href = '/';
          }
          throw new Error('Forbidden in the action!');
        }
        if (response && response.data) {
          throw response.data;
        }
        throw new Error('Can not connect!');
      });
  }

  get(url: string, headers?: { [key: string]: string }) {
    return this.request(url, 'get', null, headers);
  }

  post(url: string, data?: any, headers?: { [key: string]: string }) {
    return this.request(url, 'post', data, headers);
  }

  put(url: string, data?: any, headers?: { [key: string]: string }) {
    return this.request(url, 'put', data, headers);
  }

  del(url: string, data?: any, headers?: { [key: string]: string }) {
    return this.request(url, 'delete', data, headers);
  }

  upload(
    url: string,
    files: {
      file: any;
      fieldname: string;
    }[],
    options: {
      onProgress: Function;
      customData?: Record<any, any>;
      method?: string;
    } = {
      onProgress() { },
      method: 'POST'
    },
    pauseButton = null
  ) {
    const baseApiEndpoint = this.getBaseApiEndpoint();
    const uploadUrl = isUrl(url) ? url : `${baseApiEndpoint}${url}`;
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();

      req.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          options.onProgress({
            percentage: (event.loaded / event.total) * 100
          });
        }
      });

      req.addEventListener('load', () => {
        const success = req.status >= 200 && req.status < 300;
        const { response } = req;
        if (!success) {
          return reject(response);
        }
        return resolve(response);
      });

      req.upload.addEventListener('error', () => {
        reject(req.response);
      });

      const formData = new FormData();
      files.forEach((f) => formData.append(f.fieldname, f.file, f.file.name));
      options.customData
        && Object.keys(options.customData).forEach(
          (fieldname) => {
            if (typeof options.customData[fieldname] !== 'undefined' && !Array.isArray(options.customData[fieldname])) formData.append(fieldname, options.customData[fieldname]);
            if (typeof options.customData[fieldname] !== 'undefined' && Array.isArray(options.customData[fieldname])) {
              if (options.customData[fieldname].length) {
                for (let i = 0; i < options.customData[fieldname].length; i += 1) {
                  formData.append(fieldname, options.customData[fieldname][i]);
                }
              }
            }
          }
        );

      req.responseType = 'json';
      req.open(options.method || 'POST', uploadUrl);

      const token: any = cookie.get(TOKEN);
      req.setRequestHeader('Authorization', token || '');
      req.send(formData);
      if (pauseButton) {
        pauseButton.addEventListener('click', () => {
          req.abort();
          reject();
        });
      }
    });
  }
}
