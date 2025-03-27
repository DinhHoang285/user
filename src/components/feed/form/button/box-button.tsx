/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import {
  Image, Modal,
  Progress,
  Switch,
  Tooltip,
  Upload
} from 'antd';
import { useEffect, useState } from 'react';
import {
  AiOutlineAudio, AiOutlineDollar, AiOutlineLink, AiOutlinePlayCircle, AiOutlinePlus,
  AiOutlineDelete
} from 'react-icons/ai';
import { IFile } from '@interfaces/file';
import { checkFileType } from '@lib/file';
import dynamic from 'next/dynamic';
import {
  DateIcon, PollIcon
} from 'src/icons';
import { useIntl } from 'react-intl';
import styles from './box-button.module.scss';

const InputCalendar = dynamic(() => import('./calendar-input'));
const HtmlVideolayer = dynamic(() => import('@components/video/player/html-player'));
interface IProps {
  files: IFile[],
  uploading: boolean,
  haveFile: boolean,
  setHaveFile: Function,
  onRemove: Function;
  onAddMore: Function;
  uploadTeaser?: Function;
  setThumbnailTeaser?: Function;
  uploadThumbnail?: Function;
  setModalSetPrice?: Function;
  formData: any;
  setFormData: Function;
  addPoll: boolean;
  setAddPoll: Function;
  setPollList: Function;
  setModalRecord: Function;
  setShowFileRecord: Function;
  setDataRecord: Function;
  dataRecord: any;
  thumbnail: any;
  setThumbnail: Function;
  thumbnailTeaser: any;
  showFileRecord: boolean;
  teaser: any;

}

export default function FeedButton(props: IProps) {
  const {
    onRemove,
    files,
    onAddMore,
    uploading,
    haveFile,
    setHaveFile,
    uploadTeaser = () => { },
    setThumbnailTeaser = () => { },
    thumbnailTeaser,
    uploadThumbnail = () => { },
    setModalSetPrice = () => { },
    formData,
    setFormData,
    addPoll,
    setAddPoll = () => { },
    setPollList = () => { },
    setModalRecord = () => { },
    setShowFileRecord = () => { },
    setDataRecord = () => { },
    dataRecord,
    thumbnail,
    setThumbnail = () => { },
    showFileRecord,
    teaser
  } = props;
  const [previewUrl, setPreviewUrl] = useState(null);
  const imageAccept: string = 'image/*';
  const videoAccept = 'video/*';
  const audioAccept: string = 'audio/*';
  const initAccept: string = [imageAccept, videoAccept, audioAccept].join(',');
  const [accept, setAccept] = useState(initAccept);
  const [disable, setDisable] = useState(false);
  const [thumbnailVideo, setThumbnailVideo] = useState(null);
  const [urlVideo, setUrlVideo] = useState('');
  const [urlTeaser, setUrlTeaser] = useState('');
  const minDay = new Date();
  const intl = useIntl();

  const generateThumbnail = (file, type = '') => {
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
      if (type === 'video') {
        setThumbnailVideo(canvas.toDataURL('image/png'));
      } else if (type === 'teaser') {
        setThumbnailTeaser(canvas.toDataURL('image/png'));
      }
    });
    type === 'video' ? setUrlVideo(video.src) : setUrlTeaser(video.src);
  };

  const beforeUpload = (file: any, fileList: any): void => {
    // eslint-disable-next-line no-nested-ternary
    setAccept(() => (!fileList.length ? initAccept : (checkFileType(file, 'image') ? imageAccept : checkFileType(file, 'video') ? videoAccept : audioAccept)));
    setHaveFile(() => !fileList.length);
    generateThumbnail(file, 'video');
    onAddMore(file, fileList);
  };

  const beforeUploadTeaser = (file: any): void => {
    uploadTeaser(file);
    generateThumbnail(file, 'teaser');
  };

  const beforeUploadThumbnail = (file: any): void => {
    uploadThumbnail(file);
  };

  const onChangeOnlySub = (checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData, isSub: true, isFree: false, isSale: false, price: 0
      });
    } else {
      setFormData({
        ...formData, isSub: false, isFree: true, isSale: false, price: 0
      });
    }
  };
  const onChangeTwitter = (checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData, tweet: true
      });
    } else {
      setFormData({
        ...formData, tweet: false
      });
    }
  };

  useEffect(() => {
    if (files && files?.length > 0 && files[0].thumbnails && files[0].thumbnails.length) {
      setThumbnailVideo(files[0].thumbnails[0]);
    }
    // eslint-disable-next-line no-undef, no-nested-ternary
    setAccept(() => (!haveFile && !files.length ? initAccept : (checkFileType(files[0], 'image') ? imageAccept : checkFileType(files[0], 'video') ? videoAccept : audioAccept)));
    setDisable(() => files.length && (checkFileType(files[0], 'video') || checkFileType(files[0], 'audio')));
  }, [files, haveFile]);

  return (
    <div className={styles['container-upload']}>
      <div className={styles['box-button']}>
        <div className={styles['box-left']}>
          {['text', 'video', 'photo', 'audio'].includes(formData.type) && (
            <Upload
              customRequest={() => true}
              accept={accept}
              beforeUpload={beforeUpload}
              multiple
              showUploadList={false}
              disabled={uploading || disable || dataRecord.item}
              listType="picture"
            >
              <button type="button" className={`${styles['button-media']} ${styles.btn}`}>
                <span className={styles.icon}>
                  <AiOutlineLink />
                </span>
              </button>
            </Upload>
          )}
          {['text', 'video', 'photo', 'audio'].includes(formData.type) && (
            <button
              className={`${styles.btn} ${addPoll ? styles['btn-active'] : ''}`}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setAddPoll(!addPoll);
                if (!addPoll) {
                  setPollList([]);
                }
              }}
            >
              <PollIcon />
            </button>
          )}
          {['text', 'video', 'photo', 'audio', 'reel'].includes(formData.type) && (
            <InputCalendar
              onSubmit={(date) => {
                setFormData({ ...formData, scheduledAt: date, isSchedule: true });
              }}
              titlePopup="Schedule Post"
              buttonclick={(
                <button type="button" className={`${styles.btn} ${formData.scheduledAt ? styles['btn-active'] : ''}`}>
                  <DateIcon />
                </button>
              )}
              showTime
              minDay={minDay.toString()}
            />
          )}
          <button
            type="button"
            className={`${styles.btn} ${formData.price ? styles['btn-active'] : ''}`}
            onClick={() => setModalSetPrice(true)}
          >
            <span className={styles.icon}>
              <AiOutlineDollar />
            </span>
          </button>
          {['text', 'video', 'photo', 'audio'].includes(formData.type) && (
            <button
              type="button"
              className={`${styles.btn} ${showFileRecord ? styles['btn-active'] : ''}`}
              onClick={() => {
                setModalRecord(true);
                setShowFileRecord(false);
                setDataRecord({
                  item: null,
                  blob: null,
                  url: null,
                  fileRecord: null
                });
              }}
            >
              <span className={styles.icon}>
                <AiOutlineAudio />
              </span>
            </button>
          )}
        </div>
        <div className={styles['box-right']}>
          {formData.type !== 'product' && (
            <>
              <div className={styles['box-x']}>
                <p>
                  {intl.formatMessage({ id: 'x(Twitter)', defaultMessage: 'X (Twitter)' })}
                </p>
                <Switch defaultChecked={formData.tweet || false} value={formData.tweet} onChange={onChangeTwitter} />
              </div>
              <div className={styles['box-sub-only']}>
                <p>
                  {intl.formatMessage({ id: 'subOnly', defaultMessage: 'Sub Only' })}
                </p>
                <Switch disabled={formData.type === 'text'} defaultChecked={formData.isSub || false} value={formData.isSub} onChange={onChangeOnlySub} />
              </div>
            </>
          )}
        </div>
      </div>

      {(files.length && ['text', 'video', 'photo', 'audio'].includes(formData.type)) || showFileRecord
        // eslint-disable-next-line react/prop-types
        ? (
          <div>
            {((['video/mp3', 'video/mp4', 'audio/mpeg', 'image/png', 'image/jpeg', 'feed-video', 'feed-audio', 'feed-photo'].includes(files[0]?.type)) || showFileRecord) && formData.type !== 'product' ? (
              <div className={styles['box-thumbnail-teaser']}>
                <div className={styles['box-thumbnail']}>
                  {thumbnail
                    ? (
                      <div className={styles['box-image']}>
                        <img src={thumbnail} alt="Thumbnail Preview" style={{ width: '200px', height: 'auto' }} />
                        {files[0]?.status !== 'uploading' && (
                          <span className={styles['f-remove']}>
                            <span
                              className={styles['delfile-img']}
                              onClick={() => {
                                setThumbnail('');
                                setFormData({ ...formData, thumbnailId: '' });
                              }}
                              aria-hidden
                            >
                              <AiOutlineDelete />
                            </span>
                          </span>
                        )}
                      </div>
                    )
                    : null}
                  <Upload
                    key="upload_teaser"
                    customRequest={() => true}
                    accept={'image/*'}
                    beforeUpload={beforeUploadThumbnail}
                    multiple={false}
                    showUploadList={false}
                    listType="picture"
                  >
                    <i><AiOutlinePlus /></i>
                    <p>
                      {intl.formatMessage({ id: 'addThumbnail', defaultMessage: 'Add Thumbnail' })}
                    </p>
                  </Upload>

                </div>

                <div className={styles['box-teaser']}>
                  {thumbnailTeaser
                    ? (
                      <div
                        aria-hidden
                        className={styles['box-image']}
                        onClick={() => {
                          if (!urlTeaser) return;
                          setPreviewUrl(urlTeaser);
                        }}
                      >
                        <img src={thumbnailTeaser} alt="Thumbnail Preview" style={{ width: '200px', height: 'auto' }} />
                        {files[0].status !== 'uploading' && (
                          <span className={styles['f-remove']}>
                            <span
                              className={styles['delfile-img']}
                              onClick={() => {
                                setThumbnailTeaser('');
                                setFormData({ ...formData, teaserId: '' });
                              }}
                              aria-hidden
                            >
                              <AiOutlineDelete />
                            </span>
                          </span>
                        )}
                      </div>
                    ) : null}
                  {!['feed-photo', 'image/png', 'image/jpeg', 'feed-audio'].includes(files[0]?.type) && formData.type !== 'audio' ? (
                    <Upload
                      key="upload_teaser"
                      customRequest={() => true}
                      accept={'video/*'}
                      beforeUpload={beforeUploadTeaser}
                      multiple={false}
                      showUploadList={false}
                      listType="picture"
                    >
                      <i><AiOutlinePlus /></i>
                      <p>
                        {intl.formatMessage({ id: 'addTeaser', defaultMessage: 'Add Teaser' })}
                      </p>
                    </Upload>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        )
        : null}

      {
        files?.length > 0 && ['text', 'video', 'photo', 'audio'].includes(formData.type)
        && (
          <>
            <div className={styles['f-upload-list']}>
              {files
                // eslint-disable-next-line react/prop-types
                && files.map((file: any) => (
                  <div
                    className={styles['f-upload-item']}
                    key={file._id || file.uid}
                  >
                    <div className={styles['f-upload-thumb']}>
                      {/* eslint-disable-next-line no-nested-ternary */}
                      {file?.type?.includes('feed-photo')
                        || file?.type?.includes('image') || file?.mimeType?.includes('image')
                        ? (<Image placeholder alt="img" src={file.url ? file.url : file.thumbnail} width="100" />)
                        : file.type.includes('video') ? (
                          <span
                            className={styles['f-thumb-vid']}
                            aria-hidden
                            onClick={() => {
                              if (!urlVideo) return;
                              setPreviewUrl(urlVideo);
                            }}
                          >
                            <AiOutlinePlayCircle />
                            <img className={styles.thumbnailVideo} src={thumbnailVideo} alt="img video" />
                          </span>
                        ) : (<img alt="img" src="/no-image.jpg" width="100%" />)}
                    </div>
                    <div className={styles['f-upload-name']}>
                      <Tooltip title={file.name}>{file.name}</Tooltip>
                    </div>
                    {file.status !== 'uploading' && (
                      <span className={styles['f-remove']}>
                        <span
                          className={styles['delfile-img']}
                          onClick={() => onRemove(file)}
                          aria-hidden
                        >
                          <AiOutlineDelete />
                        </span>
                      </span>
                    )}
                    {file.percent && <Progress percent={Math.round(file.percent)} />}
                  </div>
                ))}

            </div>
            {!!previewUrl && (
              <Modal
                width={600}
                footer={null}
                onOk={() => setPreviewUrl('')}
                onCancel={() => setPreviewUrl('')}
                open={!!previewUrl}
                destroyOnClose
                centered
                className={styles['box-preview']}
              >
                <HtmlVideolayer
                  videoSrc={previewUrl}
                  thumbUrl={null}
                  priority={false}
                />
              </Modal>
            )}
          </>
        )
      }
    </div>
  );
}
