import { useState } from 'react';
import { AiOutlineDelete, AiOutlinePlayCircle } from 'react-icons/ai';
import {
  Progress, Button, Tooltip, Image, Modal
} from 'antd';
import HtmlVideolayer from '@components/video/player/html-player';
import styles from './preview-upload-list.module.scss';

interface IProps {
  removeFile: Function;
  files: any[];
}

export function PreviewUploadList({ files, removeFile: handleRemove }: IProps) {
  const [previewUrl, setPreviewUrl] = useState('');
  return (
    <div className={styles['f-upload-list']}>
      {files && files.map((file) => (
        <div className={styles['f-upload-item']} key={file._id || file.uid}>
          <div className={styles['f-upload-thumb']}>
            {/* eslint-disable-next-line no-nested-ternary */}
            {(file.type.includes('photo') || file.type.includes('image'))
              ? <Image alt="img" src={file?.url || '/no-image.jpg'} width="100%" />
              : file.type.includes('video') ? (
                <span className={styles['f-thumb-vid']} aria-hidden onClick={() => setPreviewUrl(file?.url)} style={file?.thumbnails && file?.thumbnails ? { backgroundImage: `url(${file?.thumbnails[0]})` } : {}}>
                  <AiOutlinePlayCircle />
                </span>
              ) : <img alt="img" src="/no-image.jpg" width="100%" />}
          </div>
          <div className={styles['f-upload-name']}>
            <Tooltip title={file.name}>{file.name}</Tooltip>
          </div>
          <div className={styles['f-upload-size']}>
            {(file.size / (1024 * 1024)).toFixed(2)}
            {' '}
            MB
          </div>
          {file.status !== 'uploading' && handleRemove && (
            <span className={styles['f-remove']}>
              <Button type="primary" onClick={() => handleRemove(file)}>
                <AiOutlineDelete />
              </Button>
            </span>
          )}
          {file.percent && <Progress percent={Math.round(file.percent)} />}
        </div>
      ))}
      {!!previewUrl && (
        <Modal
          width={767}
          footer={null}
          onOk={() => setPreviewUrl('')}
          onCancel={() => setPreviewUrl('')}
          open={!!previewUrl}
          destroyOnClose
        >
          <HtmlVideolayer
            videoSrc={previewUrl}
            thumbUrl={null}
            priority={false}
            aspectRatio="unset"
          />
        </Modal>
      )}
    </div>
  );
}

export default PreviewUploadList;
