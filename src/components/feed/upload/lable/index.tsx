/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import Image from 'next/image';
import styles from './index.module.scss';
import PreviewAudio from '../previews/audio';

interface IProps {
  icon: any,
  title: string,
  previewType: 'image' | 'video' | 'audio'
  file?: any,
  size?: number,
  onRemoveFile?: any
  type?: any,
}
function UploadLable({
  icon, title, size, file, onRemoveFile, type, previewType
}: IProps) {
  const renderPreview = () => {
    switch (previewType) {
      case 'audio':
        return <PreviewAudio url={file?.url || file} />;

      case 'video': {
        return (
          <Image
            fill
            alt="thumb"
            src={file._id ? file?.url : '/no-image.jpg'}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        );
      }
      default:
        return (
          <Image
            fill
            alt="thumb"
            src={file?.url || '/no-image.jpg'}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover'

            }}
          />
        );
    }
  };

  if (file) {
    return (
      <div className={styles['upload-file']}>
        <div className={styles['upload-file-preview']}>
          <p
            className={styles['upload-file-delete']}
            onClick={() => onRemoveFile(file)}
          >
            <AiOutlineDelete />
          </p>
          <div className={styles['upload-file-content']}>
            {renderPreview()}
          </div>
        </div>
        <div className={styles['upload-file-info']}>
          <p className={styles['upload-file-type']}>
            {type}
          </p>
          <p className={styles['upload-file-name']}>
            {file?.name}
          </p>
          <p className={styles['upload-file-size']}>
            {`${bytesToMB(file?.size)} MB`}
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className={styles['upload-lable']}>
      <p className={styles['upload-lable-icon']}>{icon}</p>
      <p className={styles['upload-lable-title']}>{title}</p>
      <p className={styles['upload-lable-sub']}>
        {`${size} MB`}
      </p>
    </div>
  );
}

export const bytesToMB = (bytes) => {
  const MB = bytes / (1024 * 1024);
  return MB.toFixed(2);
};

export default UploadLable;
