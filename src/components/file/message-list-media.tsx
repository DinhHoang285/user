import { AiOutlineDelete, AiOutlinePlayCircle, AiOutlinePlus } from 'react-icons/ai';
import { showError } from '@lib/message';
import {
  Button,
  Progress,
  Tooltip,
  Upload
} from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import styles from './message-list-media.module.scss';

interface IProps {
  type: string;
  onFilesSelected: Function;
}

export function MessageUploadList({ type, onFilesSelected }: IProps) {
  const [files, setFiles] = useState([]);
  const [, updateState] = useState();
  const intl = useIntl();
  const forceUpdate = useCallback(() => updateState({} as any), []);

  const onBeforeUpload = async (file: any, _files: any) => {
    const slFiles = [...files, ..._files].slice(0, 12); // limit 12
    if (slFiles.indexOf(file) > -1 && file.type.includes('image')) {
      const valid = file.size / 1024 / 1024 < 20;
      if (!valid) {
        showError(
          intl.formatMessage(
            { id: 'imageUnder20MBError', defaultMessage: '{fileName} Only send images under 20MB!' },
            { fileName: file.name }
          )
        );
        return false;
      }
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        // eslint-disable-next-line no-param-reassign
        file.thumbnail = reader.result;
        forceUpdate();
      });
      reader.readAsDataURL(file);
    }
    if (slFiles.indexOf(file) > -1 && file.type.includes('video')) {
      const valid = file.size / 1024 / 1024 < 1024;
      if (!valid) {
        showError(
          intl.formatMessage(
            { id: 'videoSizeError', defaultMessage: 'Video {fileName} must be less than 1GB!' },
            { fileName: file.name }
          )
        );
        return false;
      }
    }
    if (_files.indexOf(file) === _files.length - 1) {
      if ([...files, ..._files].length > 12) {
        showError(intl.formatMessage({ id: 'youCanOnlyUpload12Photos', defaultMessage: 'You can only upload 12 photos' }));
      }
      setFiles(slFiles);
      onFilesSelected(slFiles);
    }
    return true;
  };

  const onRemove = (file) => {
    setFiles(files.filter((f) => f.uid !== file.uid));
    onFilesSelected(files.filter((f) => f.uid !== file.uid));
  };

  useEffect(() => {
    setFiles([]);
    onFilesSelected([]);
  }, [type]);

  return (
    <div
      className={`${styles['f-upload-list']} ${styles['message-upload-list']}`}
    >
      <div className={styles['list-files']}>
        {files.map((file) => (
          <div className={styles['f-upload-item']} key={file._id || file.uid}>
            {/* eslint-disable-next-line no-nested-ternary */}
            {file.type.includes('image') ? (
              <span
                className={styles['f-upload-thumb']}
                style={{
                  backgroundImage: `url(${file?.thumbnail || file?.url || '/leaf.jpg'})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
            ) : file.type.includes('video') ? (
              <span
                style={{
                  backgroundImage: `url(${(file?.thumbnails && file?.thumbnails[0]) || '/leaf.jpg'})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
                className={styles['f-thumb-vid']}
              >
                <AiOutlinePlayCircle />
              </span>
            ) : (
              <span
                className={styles['f-upload-thumb']}
                style={{
                  backgroundImage: `url(${'/leaf.jpg'})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
            )}
            <div className={styles['desc-video-upload']}>
              <div className={styles['f-upload-name']}>
                <Tooltip title={file?.name}>{file?.name}</Tooltip>
              </div>
              <div className={styles['f-upload-size']}>
                {((file?.size || 0) / (1024 * 1024)).toFixed(2)}
                {' '}
                MB
              </div>
            </div>

            {file.status !== 'uploading' && (
              <span className={styles['f-remove']}>
                <Button type="primary" onClick={() => onRemove(file)}>
                  <AiOutlineDelete />
                </Button>
              </span>
            )}
            {file.percent && <Progress percent={Math.round(file?.percent)} />}
          </div>
        ))}
        {((type === 'photo' && files.length < 12)
          || (type === 'video' && !files.length)) && (
            <div className={styles['add-more']}>
              <Upload
                className={styles['add-more-btn']}
                maxCount={12}
                customRequest={() => true}
                accept={type === 'video' ? 'video/*' : 'image/*'}
                beforeUpload={onBeforeUpload}
                multiple={type === 'photo'}
                showUploadList={false}
                listType="picture"
              >
                <AiOutlinePlus />
              </Upload>
            </div>
        )}
      </div>
    </div>
  );
}
