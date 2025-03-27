/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-nested-ternary */
import { ReactNode } from 'react';
import { AiOutlineDelete, AiOutlinePicture, AiOutlineFileDone } from 'react-icons/ai';
import { Progress } from 'antd';
import classNames from 'classnames';

import { useIntl } from 'react-intl';
import style from './upload-list.module.scss';

interface IProps {
  remove: Function;
  setCover: Function;
  files: any[];
}
function PhotoUploadList({
  remove, setCover, files
}: IProps) {
  const intl = useIntl();
  const getPhotoThumbnail = (file: any): ReactNode => {
    if (file.thumbUrl) {
      return <img alt="thumb" src={file.thumbUrl} />;
    }

    if ((file?.fileUrl || file?.url)) {
      return <img alt="thumb" src={file?.fileUrl || file?.url} />;
    }

    // todo - check?
    if (file?.photo?.thumbnails && file?.photo?.thumbnails[0]) {
      return <img alt="thumb" src={file?.photo?.thumbnails[0]} />;
    }
    return <AiOutlinePicture />;
  };

  return (
    <div className="ant-upload-list ant-upload-list-picture">
      {files.length > 0 && files.map((file) => (
        <div
          className="ant-upload-list-item ant-upload-list-item-uploading ant-upload-list-item-list-type-picture"
          key={file._id || file.uid}
          style={{ height: 'auto' }}
        >
          <div className={classNames(
            style['photo-upload-list']
          )}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className={style['photo-thumb']}>
                {file._id && file?.photo?.thumbnails && file?.photo?.thumbnails[0] ? <img src={file?.photo?.thumbnails[0]} alt="thumb" /> : file.uid ? <img alt="thumb" src={file.thumbUrl} /> : <AiOutlinePicture />}
              </div>
              <div className={style['photo-info']}>
                <p>
                  {`${file?.name || file?.title} | ${((file?.size || Number(file?.photo?.size)) / (1024 * 1024)).toFixed(2)} MB`}
                  {' '}
                  {file._id && <AiOutlineFileDone style={{ color: 'green' }} />}
                </p>
                <div>
                  {file.isGalleryCover && (
                    <a aria-hidden>
                      {intl.formatMessage({ id: 'coverImg', defaultMessage: 'Cover IMG' })}
                    </a>
                  )}
                  {!file.isGalleryCover && file._id && (
                    <a aria-hidden onClick={() => setCover(file)}>
                      {intl.formatMessage({ id: 'setAsCoverImg', defaultMessage: 'Set as Cover IMG' })}
                    </a>
                  )}
                </div>
              </div>
            </div>
            {file.percent !== 100 && (
              <a aria-hidden className={style['remove-photo']} onClick={() => remove(file)}>
                <AiOutlineDelete />
              </a>
            )}
            {file.percent ? (
              <Progress percent={Math.round(file.percent)} />
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

export default PhotoUploadList;
