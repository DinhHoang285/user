import {
  AiOutlineAudio, AiOutlinePause, AiOutlinePauseCircle, AiOutlinePlayCircle
} from 'react-icons/ai';
import { showError } from '@lib/message';
import { useAudioRecorder } from '@sarafhbk/react-audio-recorder';
import { Button } from 'antd';
import classNames from 'classnames';
import moment from 'moment';
import { useEffect } from 'react';
import { useIntl } from 'react-intl';
import style from './audio-recorder.module.scss';

interface IProps {
  onFinish: Function;
  isActive: boolean;
  onClose: Function;
  onStartStopRecord: Function;
  getTimeRecord: Function;
}

export function AudioRecorder({
  onFinish,
  isActive,
  onClose,
  onStartStopRecord,
  getTimeRecord
}: IProps) {
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

  if (!isActive) return null;

  return (
    <div className={style['audio-recorder']}>
      <div className={style.recorder}>
        <div className={style.microphone}>
          <div
            className={classNames(style.waves, {
              [style.active]: status === 'recording'
            })}
          />
          <Button className="start-btn" onClick={() => handleStartStop()}>
            {['recording', 'paused'].includes(status)
              ? (
                <>
                  <AiOutlinePause />
                  {' '}
                  {intl.formatMessage({ id: 'stopRecording', defaultMessage: 'Stop recording' })}
                </>
              ) : (
                <>
                  <AiOutlineAudio />
                  {' '}
                  {intl.formatMessage({ id: 'startRecording', defaultMessage: 'Start recording' })}
                </>
              )}
          </Button>
        </div>
        {status !== 'idle' && (
          <div className={style.timer}>
            {moment.utc(timer * 1000).format('m:ss')}
          </div>
        )}
        {status !== 'idle' && (
          <div className={style['btn-grps']}>
            {status === 'recording' && (
              <Button onClick={pauseRecording}>
                <AiOutlinePauseCircle />
                {' '}
                {intl.formatMessage({ id: 'pause', defaultMessage: 'Pause' })}
              </Button>
            )}
            {status === 'paused' && (
              <Button onClick={resumeRecording}>
                <AiOutlinePlayCircle />
                {' '}
                {intl.formatMessage({ id: 'Resume', defaultMessage: 'Resume' })}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
