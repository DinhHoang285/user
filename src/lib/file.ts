import { IFile } from '@interfaces/file';
import { showError } from './message';

export const shimmer = (w = 256, h = 256) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#ccc" offset="20%" />
      <stop stop-color="#eee" offset="50%" />
      <stop stop-color="#ccc" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#ccc" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

export const toBase64 = (str: string) => (typeof window === 'undefined'
  ? Buffer.from(str).toString('base64')
  : window.btoa(str));

export const convertBlobUrlToFile = async (blobUrl: string, fileName: string) => {
  const blob = await fetch(blobUrl).then((r) => r.blob());
  return new File([blob], `${fileName}.${blob.type.split('/')[1]}`, { type: blob.type });
};

export const nextImageLoader = (({ src, width, quality }) => `${src}?w=${width}&q=${quality || 75}`);

export function beforeUploadImage(file) {
  const isLt2M = file.size / 1024 / 1024 < (Number(process.env.MAX_SIZE_IMAGE || 5));
  if (!isLt2M) {
    showError(`File must be less than ${process.env.MAX_SIZE_IMAGE || 5}MB`);
  }
  return isLt2M;
}

export const getImageURL = (file) => URL.createObjectURL(file);

export const isMediaType = (file: IFile, typeCompart: 'all' | 'image' | 'video' = 'all') => {
  const imageTypes = ['photo', 'image', 'gift'];
  const videoTypes = ['video'];
  let isValid = false;
  switch (typeCompart) {
    case 'image':
      isValid = imageTypes.some((t) => file?.type.includes(t));
      break;
    case 'video':
      isValid = videoTypes.some((t) => file?.type.includes(t));
      break;
    default:
      isValid = [...imageTypes, ...videoTypes].some((t) => file.type.includes(t));
      break;
  }
  return isValid;
};

export const checkVideoDuration = async (file: File): Promise<number> => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const video: HTMLVideoElement = document.createElement('video');
    video.src = e.target.result as string;
    video.onloadedmetadata = () => {
      resolve(video.duration);
    };
  };
  reader.onerror = (error) => {
    reject(error);
  };
  reader.readAsDataURL(file);
});

export function checkFileType(file: IFile, fileType: 'image' | 'video' | 'audio'): boolean {
  const imageExtensions = ['image', 'photo', '.jpg', '.jpeg', '.png', '.gif', '.bmp'];
  const videoExtensions = ['video', '.mp4', '.avi', '.mov', '.mkv'];
  const audioExtensions = ['audio', '.mp3', '.mpeg'];

  let validExtensions;
  switch (fileType) {
    case 'image':
      validExtensions = imageExtensions;
      break;
    case 'video':
      validExtensions = videoExtensions;
      break;
    default:
      validExtensions = audioExtensions;
  }

  return validExtensions.some(
    (type: string) => file?.type?.includes(type) || file?.name?.toLowerCase().endsWith(type)
  );
}
