/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import {
  AiOutlineAudio, AiOutlineCaretRight, AiOutlinePauseCircle, AiOutlinePause, AiOutlinePlayCircle
} from 'react-icons/ai';
import { useAudioRecorder } from '@sarafhbk/react-audio-recorder';
import classNames from 'classnames';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { showError } from '@lib/message';
import styles from './index.module.scss';

interface IProps {
  onFinish: Function;
  disable: boolean;
  onClose: Function;
  onStartStopRecord: Function;
  getTimeRecord: Function;
  setDataRecord: Function;
  dataRecord: any
}
function AudioRecorderLable({
  onFinish,
  disable,
  onClose,
  onStartStopRecord,
  getTimeRecord,
  dataRecord,
  setDataRecord
}: IProps) {
  const [play, setPlay] = useState(false);
  // const config = getGlobalConfig();
  const intl = useIntl();
  const {
    audioResult,
    timer,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    status
  } = useAudioRecorder();

  const handleStartStop = () => {
    if (['recording', 'paused'].includes(status)) {
      stopRecording();
      onClose();
      onStartStopRecord(false);
      getTimeRecord(timer);
    } else {
      startRecording();
      onStartStopRecord(true);
    }
  };

  useEffect(() => {
    if (audioResult) {
      onFinish(audioResult);
    }
  }, [audioResult]);

  useEffect(() => {
    if (timer >= 900) {
      showError(intl.formatMessage({ id: 'audioTheMaximum', defaultMessage: 'The maximum duration of the recording is 15 minutes' }));
      stopRecording();
      onClose();
      onStartStopRecord(false);
      getTimeRecord(timer);
    }
  }, [timer]);

  return (
    <div
      className={classNames(styles['record-wrapper'], {
        [styles['record-disable']]: disable
      })}
    >
      <p className={styles['record-icon']} onClick={disable ? () => { } : handleStartStop}>
        <AiOutlineAudio />
      </p>
      <p className={styles['record-title']}>
        {intl.formatMessage({ id: 'recordAudio', defaultMessage: 'Record Audio' })}
      </p>
      <div className={styles['action-audio']}>
        {status !== 'idle' && ['recording', 'paused'].includes(status) ? (
          <>
            <div
              className={styles['box-pause']}
              onClick={() => (disable ? () => { } : handleStartStop())}
            >
              <AiOutlinePause />
            </div>
            <div className={styles.time}>
              {' '}
              {moment.utc(timer * 1000).format('m:ss')}
            </div>
          </>
        ) : (
          <>
            <div
              className={styles['box-play']}
              onClick={() => {
                disable ? () => { } : handleStartStop();
              }}
            >
              <AiOutlineCaretRight />
            </div>
            <div className={styles.time}>00:00</div>
          </>
        )}
      </div>

      {
        status !== 'idle' && (
          <div className={styles['record-nav']}>
            <div className={styles['record-nav-item']} onClick={handleStartStop}>
              {['recording', 'paused'].includes(status)
                ? (
                  <AiOutlinePause />
                ) : (
                  <AiOutlineAudio />
                )}
            </div>

            <div className={styles['record-nav-main']}>
              {moment.utc(timer * 1000).format('m:ss')}
            </div>

            <div
              className={styles['record-nav-item']}
              onClick={status === 'recording' ? pauseRecording : resumeRecording}
            >
              {status === 'recording' && (
                <AiOutlinePauseCircle />
              )}
              {status === 'paused' && (
                <AiOutlinePlayCircle />
              )}
            </div>
          </div>
        )
      }
    </div>
  );
}

export default AudioRecorderLable;
