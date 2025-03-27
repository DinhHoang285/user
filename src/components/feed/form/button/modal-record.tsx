/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/require-default-props */
import {
  Button, Modal
} from 'antd';
import React, { useEffect } from 'react';
import { showError } from '@lib/message';
import {
  AiOutlineAudio,
  AiOutlinePause,
  AiFillCaretRight,
  AiOutlineDelete
} from 'react-icons/ai';

import classNames from 'classnames';
import { useIntl } from 'react-intl';
import { useAudioRecorder } from '@sarafhbk/react-audio-recorder';
import moment from 'moment';
import PreviewAudio from '@components/feed/upload/previews/audio';
import style from './modal-record.module.scss';

interface IProps {
  setIsModalOpen: Function,
  isModalOpen: boolean,
  setFormData?: Function,
  formData?: any,
  beforeUploadRecord?: Function,
  dataRecord?: any,
  setDataRecord?: Function,
  disable?: boolean,
  setShowFileRecord?: Function
}

function ModalRecord({
  isModalOpen, setIsModalOpen, setFormData,
  formData, beforeUploadRecord, dataRecord, setDataRecord, disable, setShowFileRecord
}: IProps) {
  const intl = useIntl();
  const {
    audioResult,
    timer,
    startRecording,
    stopRecording,
    status
  } = useAudioRecorder();

  const handleStartStop = () => {
    if (['recording', 'paused'].includes(status)) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  useEffect(() => {
    if (audioResult) {
      beforeUploadRecord(audioResult);
    }
  }, [audioResult]);

  useEffect(() => {
    if (timer >= 900) {
      showError(intl.formatMessage({ id: 'audioTheMaximum', defaultMessage: 'The maximum duration of the recording is 15 minutes' }));
      stopRecording();
    }
  }, [timer]);

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setShowFileRecord(false);
    setFormData({ ...formData, type: 'text' });
    setDataRecord({
      item: null,
      blob: null,
      url: null,
      fileRecord: null
    });
  };

  const onRemoveFile = () => {
    setShowFileRecord(false);
    setDataRecord({
      item: null,
      url: null,
      fileRecord: null,
      blob: null
    });
  };

  const renderPreview = () => <PreviewAudio url={dataRecord?.item?.url || dataRecord?.item} inModal />;
  return (
    <div>
      <Modal
        title=""
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
        className={style.container}
      >
        <div className={style['box-content']}>
          <p>
            {intl.formatMessage({ id: 'uploadMediaType', defaultMessage: 'Upload Media Type' })}
          </p>
          <hr />
          <div
            className={classNames(style['record-wrapper'], {
              [style['record-disable']]: disable
            })}
          >
            <p className={style['record-icon']} onClick={disable ? () => { } : handleStartStop}>
              <span>
                <AiOutlineAudio style={{ display: 'flex', alignItems: 'center' }} />
              </span>
            </p>
            <p className={style['record-title']}>
              {intl.formatMessage({ id: 'recordAudio', defaultMessage: 'Record Audio' })}
            </p>
            <div className={style['action-audio']}>
              {status !== 'idle' && ['recording', 'paused'].includes(status) ? (
                <>
                  <div
                    className={style['box-pause']}
                    onClick={() => (disable ? () => { } : handleStartStop())}
                  >
                    <span>
                      <AiOutlinePause style={{ display: 'flex', alignItems: 'center' }} />
                    </span>
                  </div>
                  <div className={style.time}>
                    {' '}
                    {moment.utc(timer * 1000).format('m:ss')}
                  </div>
                </>
              ) : (
                <>
                  <div
                    className={style['box-play']}
                    onClick={() => {
                      disable ? () => { } : handleStartStop();
                    }}
                  >
                    <span>
                      <AiFillCaretRight style={{ display: 'flex', alignItems: 'center' }} />
                    </span>
                  </div>
                  <div className={style.time}>00:00</div>
                </>
              )}
            </div>

            {dataRecord?.item ? (
              <div className={style['box-show-record']}>
                <div className={style['box-audio']}>
                  {renderPreview()}
                </div>
                <div className={style['box-delete']}>
                  <p
                    onClick={() => onRemoveFile()}
                  >
                    <span>
                      <AiOutlineDelete />
                    </span>
                  </p>
                </div>
              </div>
            ) : null}
          </div>
          <Button
            onClick={() => {
              setIsModalOpen(false);
              if (dataRecord?.item) {
                setFormData({ ...formData, type: 'audio' });
                setShowFileRecord(true);
              }
            }}
            className={style['button-set-record']}
            type="primary"
          >
            {intl.formatMessage({ id: 'selectMedia', defaultMessage: 'Select Media' })}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default ModalRecord;

export const bytesToMB = (bytes) => {
  const MB = bytes / (1024 * 1024);
  return MB.toFixed(2);
};
