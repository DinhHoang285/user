'use client';

import { AudioRecorder, PreviewAudioPlayer } from '@components/file';
import TipPerformerButton from '@components/performer/tip/tip-btn';
import RecordVideoBtn from '@components/record/recordVideoBtn';
import UploadFilesModal from '@components/vault/upload-files-modal';
import { formatDate } from '@lib/date';
import { convertBlobUrlToFile } from '@lib/file';
import { showError } from '@lib/message';
import { messageService } from '@services/index';
import {
  Button, Input,
  Modal,
  Popover,
  Upload
} from 'antd';
import classNames from 'classnames';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import {
  useReducer,
  useRef, useState
} from 'react';
import {
  AiFillGift, AiOutlineAudio, AiOutlineCamera, AiOutlineDelete, AiOutlineDollar, AiOutlinePicture, AiOutlineSmile,
  AiOutlineSwap,
  AiOutlineUpload,
  AiOutlineVideoCameraAdd
} from 'react-icons/ai';
import { useIntl } from 'react-intl';
import { IConversation } from 'src/interfaces';
import { useMessage } from 'src/providers/message.provider';
import PopupGift from '../modal/popup-gift';
import MessagePriceForm from '../modal/set-price-form';
import MessageUploadMedia from './MessageUploadMedia';
import style from './style.module.scss';

const Emotions = dynamic(() => (import('@components/common/emotions')), { ssr: false, loading: () => <div style={{ width: 320 }} className="skeleton-loading" /> });

interface IProps {
  conversation: IConversation;
  disabled?: boolean;
  onNewMessage: Function;
}

export default function Compose({
  conversation, disabled = false, onNewMessage
}: IProps) {
  const _input = useRef(null) as any;
  const { data: session, update: updateBalance } = useSession();
  const { setActiveConversation } = useMessage();
  const [files, setFiles] = useState([]);
  const [mediaType, setmediaType] = useState<string>('text');
  const [openMediaUpload, setOpenUpload] = useState<boolean>(false);
  const [isOpenUploadVault, setIsOpenUploadVault] = useState<boolean>(false);
  const [submiting, setsubmiting] = useState(false);
  const [text, setText] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);
  const [showPopupGift, setShowPopupGift] = useState(false);
  const [vaultExisted, setVaultExisted] = useState(null);
  const [_resetVault, forceResetVault] = useReducer((x) => x + 1, 0);
  const [teaserFile, setTeaser] = useState(null);
  const [thumbnailFile, setThumbnail] = useState(null);
  const [isRecord, setIsRecord] = useState(false);
  const [isSale, setSale] = useState(false);
  const [price, setPrice] = useState(null);
  const [openPriceModal, setOpenPriceModal] = useState(false);
  const [timeToExpried, setTimeToExpried] = useState(null);
  const [openAudioRecorder, setOpenAudio] = useState(false);
  const [audioFile, setAudio] = useState(null);
  const router = useRouter();
  const intl = useIntl();

  const resetState = () => {
    setmediaType('text');
    setOpenUpload(false);
    setsubmiting(false);
    setText('');
    setFiles([]);
    setAudio(null);
    setPrice(0);
    setIsRecord(false);
    setSale(false);
  };

  const onUploading = (file, resp: any) => {
    // eslint-disable-next-line no-param-reassign
    file.percent = resp.percentage;
    // eslint-disable-next-line no-param-reassign
    if (file.percent === 100) file.status = 'done';
    forceUpdate();
  };

  const onKeyDown = (evt) => {
    if (evt.keyCode === 13) {
      send();
    }
  };

  const onChange = (evt) => {
    setText(evt.target.value);
  };

  const onFilesSelected = (_files: any) => {
    setFiles(_files);
    setIsOpenUploadVault(false);
  };

  const handleOpenUpload = (t: 'video' | 'photo' | 'record') => {
    if (mediaType === t) {
      setOpenUpload(false);
      setmediaType('text');
      return false;
    }
    setmediaType(t);
    setOpenUpload(true);
    if (t === 'photo') {
      setTeaser(null);
    }
    if (t === 'video') {
      setThumbnail(null);
    }
    return true;
  };

  const onSelectTeaser = (file) => {
    const valid = file.size / 1024 / 1024 < Number(process.env.NEXT_PUBLIC_MAX_SIZE_FILE) || 100;
    if (!valid) {
      showError(intl.formatMessage({ id: 'teaserSizeError', defaultMessage: 'The teaser must be less than 100 MB!' }));
      return false;
    }
    setTeaser(file);
    return true;
  };

  const onSelectThumbnail = (file) => {
    const valid = file.size / 1024 / 1024 < Number(process.env.NEXT_PUBLIC_MAX_SIZE_IMAGE) || 20;
    if (!valid) {
      showError(intl.formatMessage({ id: 'thumbnailMustBeLessThan20MB!', defaultMessage: 'Thumbnail must be less than 20 MB!' }));
      return false;
    }
    setThumbnail(file);
    return true;
  };

  const onRemoveFile = (fileDel: any) => {
    const patten = fileDel.uid ? 'uid' : '_id';
    const idxDel = files.findIndex((file) => file[patten] === fileDel[patten]);
    const newFiles = [...files];
    newFiles.splice(idxDel, 1);
    setFiles(newFiles);
    if (newFiles.length === 0) setmediaType('text');
  };

  const onSubmit = async () => {
    setsubmiting(true);
    try {
      // update balance
      if (!session?.user.isPerformer && (conversation.recipientInfo as any)?.enalbePayPerMessage) {
        if (session?.user.balance < (conversation.recipientInfo as any)?.pricePerMessage) {
          showError(intl.formatMessage({ id: 'yourBalanceIsNotEnough', defaultMessage: 'Your balance is not enough' }));
          router.push('/wallet');
          return;
        }
        updateBalance({ info: { ...session?.user, balance: Number(session?.user.balance) - Number((conversation.recipientInfo as any).pricePerMessage) } });
      }

      // upload file media
      const fileIds = [];
      if ((files.length) > 6) {
        showError(intl.formatMessage({ id: 'messageUploadMaximum', defaultMessage: 'You can upload maximum 6 files!' }));
        return;
      }
      await files.reduce(async (lp, file) => {
        await lp;

        if (file._id) {
          fileIds.push(file._id);
          return;
        }

        // eslint-disable-next-line no-param-reassign
        file.status = 'uploading';
        let resp = null;

        if (file.type.indexOf('image') > -1 && session?.user.isPerformer && isSale) {
          resp = await messageService.uploadPrivatePhoto(file, {}, (r) => onUploading(file, r));
        } else if (
          (file.type.indexOf('image') > -1 && !session?.user.isPerformer)
          || (file.type.indexOf('image') > -1 && session?.user.isPerformer && !isSale)
        ) {
          resp = await messageService.uploadPublicPhoto(file, {}, (r) => onUploading(file, r));
        } else {
          resp = await messageService.uploadVideo(file, {}, (r) => onUploading(file, r));
        }

        // eslint-disable-next-line no-param-reassign
        file.status = 'done';
        fileIds.push(resp.data._id);
      }, Promise.resolve());

      const teaser = teaserFile
        && ((await messageService.uploadTeaser(
          teaserFile,
          {},
          () => null
        )) as any);
      teaser && fileIds.push(teaser.data._id);
      const thumbnail = thumbnailFile
        && ((await messageService.uploadPublicThumbnail(
          thumbnailFile,
          {},
          () => null
        )) as any);
      thumbnail && fileIds.push(thumbnail.data._id);
      const _convertedBlobAudioFile = audioFile
        && (await convertBlobUrlToFile(
          audioFile,
          `message_audio_${new Date().getTime()}`
        ));
      const audio = audioFile
        && ((await messageService.uploadAudio(
          _convertedBlobAudioFile,
          {},
          () => null
        )) as any);
      audio && fileIds.push(audio.data._id);
      const resp = await messageService.sendMessage(conversation._id, {
        text,
        fileIds,
        isSale,
        price: !isSale ? 0 : price,
        timeToExpried: !isSale ? null : timeToExpried,
        type: ['video', 'record'].includes(mediaType) ? 'video' : mediaType
      });
      resetState();
      forceResetVault();
      _input.current && _input.current.focus();
      onNewMessage(resp.data);
    } catch (e) {
      setsubmiting(false);
      showError(e);
      Number(session?.user?.balance) > 0 && updateBalance({ info: { ...session?.user, balance: Number(session.user.balance) - Number((conversation.recipientInfo as any).pricePerMessage) } });
    } finally {
      setsubmiting(false);
    }
  };

  const send = () => {
    if (openMediaUpload && !files.length) {
      showError(intl.formatMessage({ id: 'selectAFileUpload', defaultMessage: 'Select a file upload' }));
      return;
    }

    if (!openMediaUpload && !text.trim()) {
      showError(intl.formatMessage({ id: 'enterYourMessage', defaultMessage: 'Enter your message ' }));
      return;
    }

    if (isRecord && !files.length) {
      showError(intl.formatMessage({ id: 'pleaseRecordYourClip', defaultMessage: 'Please record your clip' }));
      return;
    }

    onSubmit();
  };

  return (
    <div className={classNames(
      style['compose-container']
    )}
    >
      {showPopupGift && (
        <PopupGift
          setShowPopupGift={setShowPopupGift}
          conversation={conversation}
          onNewMessage={onNewMessage}
        />
      )}
      {session?.user.isPerformer && ['photo', 'video'].includes(mediaType) && (
        <div className={style['top-btn-groups']}>
          <Button
            disabled={submiting}
            className={classNames(
              style['btn-groups-item'],
              style['preview-btn'],
              {
                [style.active]: teaserFile || thumbnailFile
              }
            )}
          >
            {teaserFile || thumbnailFile ? (
              <Upload
                className={style['btn-groups-upload']}
                customRequest={() => true}
                accept={mediaType === 'video' ? 'video/*' : 'image/*'}
                beforeUpload={(f) => (mediaType === 'video'
                  ? onSelectTeaser(f)
                  : onSelectThumbnail(f))}
                multiple={false}
                showUploadList={false}
                listType="picture"
              >
                <AiOutlineSwap />
                {intl.formatMessage({ id: 'changePreview', defaultMessage: 'Change preview' })}
              </Upload>
            ) : (
              <Upload
                className={style['btn-groups-upload']}
                customRequest={() => true}
                accept={mediaType === 'video' ? 'video/*' : 'image/*'}
                beforeUpload={(f) => (mediaType === 'video'
                  ? onSelectTeaser(f)
                  : onSelectThumbnail(f))}
                multiple={false}
                showUploadList={false}
                listType="picture"
              >
                <AiOutlineUpload />
                {intl.formatMessage({ id: 'insertPreview', defaultMessage: 'Insert preview' })}
              </Upload>
            )}
          </Button>
          {!conversation?.recipientInfo?.isPerformer && (
            <Button
              disabled={submiting}
              onClick={() => setOpenPriceModal(true)}
              className={
                isSale
                  ? `${style['btn-groups-item']} ${style['sale-btn']} ${style.active}`
                  : `${style['btn-groups-item']} ${style['sale-btn']}`
              }
            >
              <div className={style['btn-groups-content']}>
                <p>
                  {!isSale ? 'Public' : `€${price}`}
                </p>
                {
                  timeToExpried
                  && <p>{formatDate(new Date(timeToExpried), 'DD/MM/YYYY hh:mm A')}</p>
                }
              </div>
            </Button>
          )}
        </div>
      )}
      {files.length > 0 && (
        <MessageUploadMedia
          files={files}
          onRemoveFile={onRemoveFile}
          onToggleUploadFromVault={() => setIsOpenUploadVault(true)}
          disabled={disabled}
        />
      )}
      {
        audioFile && (
          <div className={style['audio-player']}>
            <PreviewAudioPlayer source={audioFile} />
            &nbsp;
            <Button onClick={() => setAudio(null)}>
              <AiOutlineDelete />
            </Button>
          </div>
        )
      }
      <div className={style['compose-chat']}>
        <Input.TextArea
          value={text}
          className={style['compose-input']}
          placeholder={intl.formatMessage({ id: 'writeYouMessage', defaultMessage: 'Write your message...' })}
          onKeyDown={onKeyDown}
          onChange={onChange}
          disabled={disabled || !conversation._id || submiting}
          ref={_input}
          autoFocus
        />
        <AudioRecorder
          getTimeRecord={(t) => console.log(t)}
          isActive={openAudioRecorder}
          onStartStopRecord={(s) => console.log(s)}
          onFinish={(file) => setAudio(file)}
          onClose={() => setOpenAudio(false)}
        />
        <div className={style['bottom-btn-groups']}>
          <div className={style['grp-left']}>
            <UploadFilesModal
              setMediaType={setmediaType}
              setOpenUpload={setOpenUpload}
              needDefaultOpen={mediaType === 'photo' ? isOpenUploadVault : null}
              onSubmit={onFilesSelected}
              multiple
              btnLabel={(
                <Button
                  disabled={disabled || submiting}
                  className={classNames(style['btn-group-items'], {
                    [style.active]: mediaType === 'photo'
                  })}
                >
                  <AiOutlinePicture />
                </Button>
              )}
              vaultType="image"
              accept="image/*"
              vaultExisted={vaultExisted && vaultExisted.type === 'image' ? vaultExisted : null}
              reset={_resetVault}
              onOpenModal={() => handleOpenUpload('photo')}
              onCloseModal={() => {
                setVaultExisted(null);
                setIsOpenUploadVault(false);
              }}
              uploadFileRef={files}
            />
            {session?.user.isPerformer && (
              <>
                <RecordVideoBtn
                  lableBtn={(
                    <Button
                      disabled={disabled || submiting}
                      className={style['btn-group-items']}
                      onClick={() => {
                        handleOpenUpload('record');
                        setIsRecord(!isRecord);
                      }}
                    >
                      <AiOutlineCamera />
                    </Button>
                  )}
                  isRecord={isRecord}
                  setIsRecord={setIsRecord}
                  isSale={isSale}
                  setSale={setSale}
                  price={price}
                  setPrice={setPrice}
                  onFileRecorded={(_files) => {
                    setFiles(_files);
                  }}
                  onSendMsg={onSubmit}
                />

                <UploadFilesModal
                  needDefaultOpen={mediaType === 'video' ? isOpenUploadVault : null}
                  onSubmit={onFilesSelected}
                  setMediaType={setmediaType}
                  setOpenUpload={setOpenUpload}
                  btnLabel={(
                    <Button
                      disabled={disabled || submiting}
                      className={
                        mediaType === 'video' && !isRecord
                          ? `${style.active} ${style['btn-group-items']}`
                          : style['btn-group-items']
                      }
                    >
                      <AiOutlineVideoCameraAdd />
                    </Button>
                  )}
                  vaultType="video"
                  accept="video/*"
                  vaultExisted={vaultExisted && vaultExisted.type === 'video' ? vaultExisted : null}
                  reset={_resetVault}
                  onOpenModal={() => handleOpenUpload('video')}
                  onCloseModal={() => {
                    setVaultExisted(null);
                    setIsOpenUploadVault(false);
                  }}
                  options={
                    {
                      maxFileSize: 50000
                    }
                  }
                />
                {!conversation?.recipientInfo?.isPerformer && (
                  <Button
                    disabled={disabled || submiting}
                    onClick={() => setOpenPriceModal(true)}
                    className={classNames(style['btn-group-items'], {
                      [style.active]: openPriceModal
                    })}
                  >
                    <AiOutlineDollar />
                  </Button>
                )}

                <Button
                  disabled={disabled || submiting}
                  onClick={() => setOpenAudio(!openAudioRecorder)}
                  className={classNames(style['btn-group-items'], {
                    [style.active]: openAudioRecorder
                  })}
                >
                  <AiOutlineAudio />
                </Button>
              </>
            )}
            <Popover
              destroyTooltipOnHide={false}
              className="emotion-popover"
              content={(
                <Emotions
                  onEmojiClick={(emoji) => setText(`${text} ${emoji} `)}
                />
              )}
              trigger={['click']}
            >
              <Button
                disabled={disabled || submiting}
                className={style['btn-group-items']}
              >
                <AiOutlineSmile />
              </Button>
            </Popover>
            {
              conversation.recipientInfo?.isPerformer
              && (
                <div
                  className={`${style['btn-group-items']} ${style['tip-btn']}`}
                >
                  <TipPerformerButton
                    performer={(conversation.recipientInfo as any)}
                    conversationId={conversation._id}
                    hideText
                    inPrivateChat
                    onNewMessage={onNewMessage}
                  />
                </div>
              )
            }
            {!session?.user?.isPerformer && (
              <Button
                disabled={disabled || submiting}
                className={style['btn-group-items']}
                onClick={() => setShowPopupGift(!showPopupGift)}
              >
                <AiFillGift />
              </Button>
            )}
          </div>
          <div className={style['grp-right']}>
            <Button
              className={classNames(style['secondary-btn'], 'secondary')}
              onClick={() => setActiveConversation(null)}
              disabled={submiting}
            >
              {intl.formatMessage({ id: 'cancel', defaultMessage: 'Cancel' })}
            </Button>
            <Button
              disabled={disabled || submiting}
              loading={submiting}
              className={classNames(style['primary-btn'], 'primary')}
              onClick={() => onSubmit()}
            >
              {intl.formatMessage({ id: 'send', defaultMessage: 'Send' })}
              {!session?.user?.isPerformer
                && (conversation.recipientInfo as any)?.enalbePayPerMessage
                && `( € ${((conversation.recipientInfo as any)?.pricePerMessage || 0).toFixed(2)} )`}
            </Button>
          </div>
        </div>
        {openPriceModal && (
          <Modal
            key="tip_performer"
            className={style['message-price-modal']}
            title={null}
            width={500}
            open={openPriceModal}
            onOk={() => setOpenPriceModal(false)}
            footer={null}
            onCancel={() => setOpenPriceModal(false)}
          >
            <MessagePriceForm
              price={price}
              isSale={isSale}
              timeToExpried={timeToExpried}
              onFinish={(data) => {
                setSale(data.isSale);
                setPrice(data.price);
                setTimeToExpried(data?.timeToExpried);
                setOpenPriceModal(false);
              }}
              onClose={() => setOpenPriceModal(false)}
            />
          </Modal>
        )}
      </div>
    </div>
  );
}
