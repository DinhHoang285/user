import { AiOutlineDelete, AiOutlinePlus } from 'react-icons/ai';
import { getImageURL } from '@lib/file';
import {
  Button,
  Progress,
  Spin,
  Tooltip
} from 'antd';
import classNames from 'classnames';
import { useIntl } from 'react-intl';
import HtmlVideolayer from '@components/video/player/html-player';
import style from './MessageUploadMedia.module.scss';

interface IProps {
  files: any[];
  disabled: boolean;
  onToggleUploadFromVault: Function,
  onRemoveFile: Function,
}

function MessageUploadMedia({
  files,
  disabled,
  onToggleUploadFromVault,
  onRemoveFile
}: IProps) {
  const intl = useIntl();

  return (
    <div className={classNames(style['message-upload-list'])}>
      {files?.length > 0 && (
        <div className={style['list-files']}>
          {files.map((file) => (
            <div className={style['f-upload-item']} key={file._id || file.uid}>
              {file.type.includes('image')
                && (file?.url ? (
                  <img
                    className={style['f-upload-thumb']}
                    src={file?.url || '/no-image.jpg'}
                    alt="thumb"
                    style={{
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <img
                    className={style['f-upload-thumb']}
                    src={getImageURL(file) || '/no-image.jpg'}
                    alt="thumb"
                    style={{
                      objectFit: 'cover'
                    }}
                  />
                ))}
              {file.type.includes('video') && (file?.url ? (
                <Button
                  className={style['f-upload-preview-vid']}
                >
                  <HtmlVideolayer
                    videoSrc={file.url}
                    thumbUrl={null}
                    priority={false}
                  />
                </Button>
              ) : (
                <div className={style['f-loading-upload']}><Spin /></div>
              ))}
              <div className={style['desc-video-upload']}>
                <div className={style['f-upload-name']}>
                  <Tooltip title={file?.name}>{file?.name}</Tooltip>
                </div>
                <div className={style['f-upload-size']}>
                  {((file?.size || 0) / (1024 * 1024)).toFixed(2)}
                  {' '}
                  MB
                </div>
              </div>
              {file.status !== 'uploading' && !disabled && (
                <Tooltip title={intl.formatMessage({ id: 'remove', defaultMessage: 'Remove' })}>
                  <Button
                    type="primary"
                    onClick={() => onRemoveFile(file)}
                    className={style['f-remove']}
                    disabled={disabled}
                  >
                    <AiOutlineDelete className="default-icon" />
                  </Button>
                </Tooltip>
              )}
              {file.percent && <Progress className={style['f-progress']} percent={Math.round(file.percent)} />}
            </div>
          ))}
        </div>
      )}
      {!(files?.length >= 12) && (
        <Button className={style['add-more']} onClick={() => onToggleUploadFromVault()}>
          <AiOutlinePlus />
        </Button>
      )}
    </div>
  );
}

export default MessageUploadMedia;
