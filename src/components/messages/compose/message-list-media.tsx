/* eslint-disable no-nested-ternary */

'use client';

import {
  AiOutlineDown, AiOutlinePlus, AiOutlineDelete, AiOutlinePlayCircle
} from 'react-icons/ai';
import { showError } from '@lib/message';
import { Button, Progress, Upload } from 'antd';
import { useEffect, useReducer, useState } from 'react';
import { useIntl } from 'react-intl';

interface IProps {
  onFilesSelected: Function;
  onClose: Function;
  limit: number;
}

export default function MessageUploadList({ onFilesSelected, onClose, limit }: IProps) {
  const intl = useIntl();
  const [files, setFiles] = useState([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);

  const onBeforeUpload = async (file: any, _files: any) => {
    const slFiles = [...files, ..._files].slice(0, limit); // limit limit

    if (!file.type.includes('image') && !file.type.includes('video')) {
      showError(
        intl.formatMessage({
          id: 'messageUpload!',
          defaultMessage: 'You can only upload photos and videos!'
        })
      );
      return false;
    }

    if (slFiles.indexOf(file) > -1 && file.type.includes('image')) {
      const maxSizeImage = Number(process.env.MAX_SIZE_IMAGE || 100);
      const valid = file.size / 1024 / 1024 < maxSizeImage;
      if (!valid) {
        showError(
          intl.formatMessage(
            {
              id: 'photo{Name}MustBeLessThan{MaxSize}MB!',
              defaultMessage: 'Photo {name} must be less than {maxSize}MB!'
            },
            { name: file.name, maxSize: maxSizeImage }
          )
        );
        return false;
      }
      // eslint-disable-next-line no-param-reassign
      file.thumbnail = URL.createObjectURL(file);
    }

    if (slFiles.indexOf(file) > -1 && file.type.includes('video')) {
      const maxSizeVideo = Number(process.env.MAX_SIZE_VIDEO || 5000);
      const valid = file.size / 1024 / 1024 < maxSizeVideo;
      if (!valid) {
        showError(
          intl.formatMessage(
            {
              id: 'video{Name}MustBeLessThan{MaxSize}MB!',
              defaultMessage: 'Video {name} must be less than {maxSize}MB!'
            },
            { name: file.name, maxSize: maxSizeVideo }
          )
        );
        return false;
      }
      handleLoadPreviewVideo(file);
    }

    if (_files.indexOf(file) === _files.length - 1) {
      if ([...files, ..._files].length > limit) {
        showError(
          intl.formatMessage(
            {
              id: 'youCanUploadMaximum{Limit}Files!',
              defaultMessage: 'You can upload maximum {limit} files!'
            }
          )
        );
      }
      setFiles(slFiles);
      onFilesSelected(slFiles);
    }
    return true;
  };

  const handleLoadPreviewVideo = (file) => {
    const video = document.createElement('video');
    const blobUrl = URL.createObjectURL(file);
    video.src = blobUrl;
    // eslint-disable-next-line no-param-reassign
    file.url = blobUrl;
    // Load video in Safari / IE11
    video.muted = true;
    video.playsInline = true;

    video.addEventListener('loadeddata', () => {
      setTimeout(() => {
        video.currentTime = 0;
      }, 1000);
    });

    video.addEventListener('seeked', () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = 500;
      canvas.height = 500;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      // eslint-disable-next-line no-param-reassign
      file.thumbnail = canvas.toDataURL();
      forceUpdate();
    });
  };

  const onRemove = (file) => {
    setFiles(files.filter((f) => f.uid !== file.uid));
    onFilesSelected(files.filter((f) => f.uid !== file.uid));
  };

  useEffect(() => {
    setFiles([]);
    onFilesSelected([]);
  }, []);

  return (
    <div className="m-upload-list">
      <button
        aria-label="close"
        type="button"
        className="close-btn"
        onClick={() => onClose()}
      >
        <AiOutlineDown />
      </button>
      {files.map((file) => (
        <div className="m-upload-item" key={file._id || file.uid}>
          {file.type.includes('image') ? (
            <span
              className="m-upload-thumb"
              style={{
                backgroundImage: `url(${file?.thumbnail || file?.url || '/no-image.jpg'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
          ) : file.type.includes('video') ? (
            <span
              style={{
                backgroundImage: `url(${file?.thumbnail || (file?.thumbnails && file?.thumbnails[0])})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
              className="m-thumb-vid"
              aria-hidden
            >
              <AiOutlinePlayCircle />
            </span>
          ) : (
            <span
              className="m-upload-thumb"
              style={{
                backgroundImage: `url(${'/no-image.jpg'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
          )}
          {file.status !== 'uploading' && (
            <Button
              className="m-remove"
              type="primary"
              onClick={() => onRemove(file)}
            >
              <AiOutlineDelete />
            </Button>
          )}
          {file.percent > 0 ? <Progress percent={Math.round(file?.percent)} /> : null}
        </div>
      ))}
      {files.length < limit && (
        <div className="add-more">
          <Upload
            maxCount={limit}
            customRequest={() => true}
            accept={'video/*,image/*'}
            beforeUpload={onBeforeUpload}
            multiple
            showUploadList={false}
            listType="picture"
          >
            <AiOutlinePlus />
          </Upload>
        </div>
      )}
    </div>
  );
}
