'use client';

import { supportedLocales } from 'src/constants';
import { showError } from './message';

export function getImageBase64(img, callback) {
  const reader = new FileReader();

  reader?.addEventListener('load', () => callback(reader.result));
  reader?.readAsDataURL(img);
}

export function getThumbnail(item, defaultThumb = '/leaf.jpg') {
  const images = item?.files?.filter((f) => f.type === 'feed-photo') || [];
  const videos = item?.files?.filter((f) => f.type === 'feed-video') || [];
  return (item?.thumbnail?.thumbnails && item?.thumbnail?.thumbnails[0])
    || (images && images[0] && images[0]?.thumbnails && images[0]?.thumbnails[0])
    || (item?.teaser && item?.teaser?.thumbnails && item?.teaser?.thumbnails[0])
    || (videos && videos[0] && videos[0]?.thumbnails && videos[0]?.thumbnails[0])
    || defaultThumb;
}

export function getResponseError(data: any) {
  if (!data) {
    return '';
  }

  if (Array.isArray(data.message)) {
    const item = data.message[0];
    if (!item.constraints) {
      return data.error || 'Bad request!';
    }
    return Object.values(item.constraints)[0];
  }

  // TODO - parse for langauge or others
  return typeof data.message === 'string' ? data.message : 'Bad request!';
}

export function isLocale(locale: string | string[]) {
  if (Array.isArray(locale)) {
    return supportedLocales.includes(locale[0]);
  }

  return supportedLocales.includes(locale);
}

export function checkFileSize(size: number, type = 'image') {
  // const { publicRuntimeConfig } = getConfig();
  const fileSize = size / 1024 / 1024;
  let valid = true;
  let maxSize = process.env.MAX_SIZE_FILE;
  switch (type) {
    case 'image': maxSize = process.env.MAX_SIZE_IMAGE;
      break;
    case 'video': maxSize = process.env.MAX_SIZE_VIDEO;
      break;
    case 'teaser': maxSize = process.env.MAX_SIZE_TEASER;
      break;
    default: maxSize = process.env.MAX_SIZE_FILE;
  }
  valid = fileSize < Number(maxSize);
  if (!valid) {
    showError(`File is too large please provide a file ${maxSize}MB or below`);
  }
  return valid;
}
