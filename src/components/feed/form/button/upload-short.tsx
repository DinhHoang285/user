import { Upload, Modal } from 'antd';
import { AiOutlinePlus, AiOutlinePlayCircle, AiOutlineDelete } from 'react-icons/ai';
import { useState } from 'react';
import { IFile } from '@interfaces/file';
import HtmlVideolayer from '@components/video/player/html-player';
import { useIntl } from 'react-intl';
import style from './upload-short.module.scss';

interface IProps {
  uploadFile: Function,
  setThumbnail: Function,
  thumbnail: any,
  remove: Function
}

function UploadShort({
  uploadFile, setThumbnail, thumbnail, remove
}: IProps) {
  const intl = useIntl();
  const [previewUrl, setPreviewUrl] = useState(null);
  const [urlShort, setUrlShort] = useState('');
  const [fileShort, setFileShort] = useState(null);

  const beforeUpload = (file, fileList: IFile[] | any) => {
    const video = document.createElement('video');
    video.src = URL.createObjectURL(file);
    video.addEventListener('loadeddata', () => {
      video.currentTime = 1;
    });

    video.addEventListener('seeked', () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth / 2;
      canvas.height = video.videoHeight / 2;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      setThumbnail(canvas.toDataURL('image/png'));
    });
    setUrlShort(video.src);
    setFileShort(file);
    uploadFile(file, fileList);
  };

  return (
    <div className={style.container}>
      <Upload
        key="upload_teaser"
        customRequest={() => true}
        accept={'video/*'}
        beforeUpload={beforeUpload}
        multiple={false}
        showUploadList={false}
        listType="picture"
        className={style.content}
        disabled={!!thumbnail}
      >
        <div className={style['box-upload']}>
          <i><AiOutlinePlus /></i>
          <p>{intl.formatMessage({ id: 'addMovieFile', defaultMessage: 'Add Movie File' })}</p>
          <span>500MB</span>
        </div>
        {thumbnail ? (
          <div className={style['box-image']}>
            <button
              type="button"
              className={style['box-play']}
              onClick={() => {
                setPreviewUrl(urlShort);
              }}
            >
              <AiOutlinePlayCircle />
            </button>
            <img src={thumbnail} alt={intl.formatMessage({ id: 'thumbnailPreview', defaultMessage: 'Thumbnail Preview' })} style={{ width: '200px', height: 'auto' }} />
            <button
              type="button"
              className={style['box-delete']}
              onClick={(e) => {
                setThumbnail('');
                remove(fileShort);
                setFileShort(null);
                e.preventDefault();
              }}
            >
              <AiOutlineDelete />
            </button>
          </div>
        ) : null}
      </Upload>
      {!!previewUrl && (
        <Modal
          width={500}
          height={500}
          footer={null}
          onOk={() => setPreviewUrl('')}
          onCancel={() => setPreviewUrl('')}
          open={!!previewUrl}
          destroyOnClose
          centered
          className={style['box-preview']}
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

export default UploadShort;
