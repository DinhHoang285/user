/* eslint-disable no-param-reassign */

import {
  AiOutlineAudioMuted, AiOutlineAudio, AiOutlineBorder, AiOutlineLoading, AiOutlinePauseCircle, AiOutlinePlayCircle, AiOutlineSwap, AiOutlineUndo
} from 'react-icons/ai';
import { detectFrontBackCamera, getCameraList, identifyMainCamera } from '@lib/camera';
import { recordFormatTime } from '@lib/duration';
import { convertBlobUrlToFile } from '@lib/file';
import { showError } from '@lib/message';
import { useIntl } from 'react-intl';
import {
  Button,
  InputNumber, Modal, Select
} from 'antd';
import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';
import styles from './record.module.scss';

const VideoRecorder = dynamic(() => import('./recorderVideo'), { ssr: false });
const RecordModalDeleted = dynamic(() => import('./recordModalDeleted'), { ssr: false });

const videoJsOptions = {
  controls: true,
  bigPlayButton: true,
  controlBar: {
    cameraButton: false
  },
  width: 500,
  height: 320,
  fluid: false,
  plugins: {
    record: {
      audio: true,
      video: true,
      maxLength: 10,
      debug: true,
      aspectRatio: 16 / 9
    }
  }
};

interface IProps {
  open: boolean;
  setOpen: any;
  setFile: any;
  onSendMsg: Function,
  isSale: boolean,
  setSale: Function,
  price: number,
  setPrice: Function,
}

function RecordModal(props: IProps) {
  const {
    open, setOpen, setFile, onSendMsg, isSale, setSale, price, setPrice
  } = props;
  const videoRecorderRef = useRef(null);
  const [timer, setTimer] = useState(0);
  const [options, setOptions] = useState(videoJsOptions);
  const [cameraList, setCameraList] = useState<any[]>([]);
  const [camera, setCamera] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);
  const [isPause, setIsPause] = useState(false);
  const [isFinish, setIsFinish] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isDeleted, setIsDeteled] = useState(false);
  const intl = useIntl();

  const handleVideoRecorderReady = (videoRecorder) => {
    videoRecorderRef.current = videoRecorder;

    videoRecorder.one('deviceReady', () => {
      videoRecorderRef.current.record().enumerateDevices();
    });

    videoRecorder.on('enumerateReady', async () => {
      const cameras = await getCameraList();
      // No Cam
      if (cameras.length === 0) {
        setOpen(false);
        showError(
          intl.formatMessage({
            id: 'notFoundAnyCameraInYourDevices',
            defaultMessage: 'Not Found any camera in your devices'
          })
        );
        return;
      }
      // Front / back
      if (cameras.length >= 2) {
        const { frontCameras, backCameras } = detectFrontBackCamera(cameras);
        const mainFront = await identifyMainCamera(frontCameras);
        const mainBack = await identifyMainCamera(backCameras);
        setCameraList([mainFront, mainBack]);
        setCamera(mainFront?.deviceId);
        return;
      }

      setCameraList(cameras);
      setCamera(cameras[0].deviceId);
    });

    videoRecorder.on('deviceReady', () => {
      setIsReady(true);
    });

    videoRecorder.on('deviceError', () => {
      setOpen(false);
      showError(
        intl.formatMessage({
          id: 'youDoNotAllowTheBrowserToAccessTheCameraAnd/OrMicrophone',
          defaultMessage: 'You do not allow the browser to access the webcam and / or microphone'
        })
      );
    });

    videoRecorder.on('progressRecord', () => {
      const timerWasRecord = videoRecorderRef.current?.record().getCurrentTime();
      setTimer(Math.floor(timerWasRecord));
    });

    videoRecorder.on('startRecord', () => {
      setIsRecording(true);
      setIsFinish(false);
    });

    videoRecorder.on('stopRecord', () => {
      setIsRecording(false);
    });

    videoRecorder.on('finishRecord', async () => {
      try {
        setIsProcessing(true);
        const recordFile = videoRecorder.recordedData;
        const recordFileUrl = URL.createObjectURL(recordFile);
        const file = recordFileUrl && await convertBlobUrlToFile(recordFileUrl, `record_clip_${new Date().getTime()}`);
        setFile([file]);
        setIsFinish(true);
      } catch (error) {
        showError(
          error.message
          || intl.formatMessage({
            id: 'anErrorOccurred',
            defaultMessage: 'An error occurred'
          })
        );
        setOpen(false);
      } finally {
        setIsProcessing(false);
      }
    });
  };

  const handelTooglePause = () => {
    if (videoRecorderRef.current) {
      isPause
        ? videoRecorderRef.current.record().resume()
        : videoRecorderRef.current.record().pause();
      setIsPause(!isPause);
    }
  };

  const handelToggleMic = () => {
    const nextOptions = { ...options };
    const isAudioMuted = nextOptions.plugins.record.audio;
    if (videoRecorderRef.current && videoRecorderRef.current.record) {
      const tracks = videoRecorderRef.current.record().stream.getAudioTracks();
      tracks.forEach((track) => {
        track.enabled = !isAudioMuted;
      });
    }
    nextOptions.plugins.record.audio = !isAudioMuted;
    setOptions(nextOptions);
  };

  const handelReset = () => {
    if (videoRecorderRef.current) {
      videoRecorderRef.current.record().reset();
      videoRecorderRef.current.record().getDevice();
      setIsFinish(false);
    }
  };

  const handelClose = () => {
    if (videoRecorderRef.current) {
      videoRecorderRef.current.record().stopDevice();
      setOpen(false);
    }
  };

  const handelSendClip = async () => {
    try {
      setIsSending(true);
      await onSendMsg();
      handelReset();
      setOpen(false);
    } catch (error) {
      showError(error);
    } finally {
      setIsSending(false);
    }
  };

  const handelClickDeleted = async () => {
    setIsDeteled(true);
    setOpen(false);
  };

  const handleClickInDelModel = (isConfirm = false) => {
    if (isConfirm) {
      handelReset();
    }
    setIsDeteled(false);
    setOpen(true);
  };

  const handelChangeSale = (val) => {
    if (val === 'false') setPrice(null);
    if (val === 'true') setPrice(20);
    setSale(Boolean(val));
  };

  const handelChangeCamera = () => {
    const idx = cameraList.findIndex((f) => f.deviceId === camera);
    const nextIdx = idx === cameraList.length - 1 ? 0 : idx + 1;
    const { deviceId } = cameraList[nextIdx];
    setCamera(deviceId);
    try {
      videoRecorderRef.current.record().setVideoInput(deviceId);
    } catch (error) {
      console.warn(error);
    }
  };

  return (
    <>
      <Modal
        style={{ margin: 0, padding: 0 }}
        title="Record Clip"
        open={open}
        footer={null}
        centered
        width="550px"
        onCancel={() => handelClose()}
        className={styles['record-wrapper']}
      >
        <div className={styles['record-modal']}>
          <div className={styles.recorder}>
            {(!isReady || isProcessing) && (
              <div className={styles['recorder-wrapper']}>
                <span><AiOutlineLoading /></span>
                <p style={{ marginTop: '16px' }}>
                  <span>
                    {isProcessing
                      ? intl.formatMessage({
                        id: 'pleaseWaitWhileYourRecordProcessing',
                        defaultMessage: 'Please wait while your record processing'
                      })
                      : intl.formatMessage({
                        id: 'pleaseWaitWhileDevicesGettingReady...',
                        defaultMessage: 'Please wait while devices getting ready...'
                      })}
                  </span>

                </p>
              </div>
            )}
            <div
              className={styles['recorder-content']}
              style={{ opacity: isReady ? 1 : 0 }}
            >
              <VideoRecorder options={options} onReady={handleVideoRecorderReady} getDevices />
              {videoRecorderRef && (
                <div>
                  {isFinish ? (
                    <div className={styles['recorder-btn']}>
                      <Button
                        className={`${styles['recorder-btn-item']} ${styles['send-btn']}`}
                        onClick={() => handelSendClip()}
                        disabled={isSending}
                      >
                        <span>
                          {isSending
                            ? intl.formatMessage({ id: 'pleaseWait', defaultMessage: 'Please wait' })
                            : intl.formatMessage({ id: 'sendInChat', defaultMessage: 'Send in chat' })}
                        </span>
                      </Button>
                      <div className={`${styles['recorder-btn-item']} ${styles['price-btn']}`}>
                        <Select
                          className={styles.select}
                          value={isSale.toString()}
                          onChange={(val) => handelChangeSale(val)}
                        >
                          <Select.Option key="true" value="true">
                            <span>{intl.formatMessage({ id: 'pay-ChargeForContent', defaultMessage: 'Pay - Charge for content' })}</span>
                          </Select.Option>
                          <Select.Option key="false" value="false">
                            <span>{intl.formatMessage({ id: 'public-EveryoneCanAccess', defaultMessage: 'Public - Everyone can access' })}</span>
                          </Select.Option>
                        </Select>
                        <InputNumber
                          className={styles.input}
                          placeholder="Price"
                          value={price}
                          onChange={(val: any) => setPrice(val)}
                          style={{ width: '100%' }}
                          min={1}
                          disabled={!isSale}
                        />
                      </div>
                      <Button
                        className={styles['recorder-btn-item']}
                        onClick={handelClickDeleted}
                      >
                        <span><AiOutlineUndo /></span>
                      </Button>
                    </div>
                  ) : (
                    <div className={styles['recorder-btn']}>
                      <Button
                        className={`${styles['recorder-btn-item']} ${styles['send-btn']}`}
                        onClick={() => {
                          if (!isRecording && videoRecorderRef.current) {
                            videoRecorderRef.current.record().start();
                          } else {
                            handelTooglePause();
                          }
                        }}
                      >
                        <span>
                          {isRecording
                            ? `${recordFormatTime(timer)} / ( ${recordFormatTime(10 - timer)} ${intl.formatMessage({ id: 'remaining', defaultMessage: 'remaining' })} )`
                            : intl.formatMessage({ id: 'startRecord', defaultMessage: 'Start record' })}
                        </span>
                      </Button>
                      <Button
                        className={styles['recorder-btn-item']}
                        onClick={() => handelToggleMic()}
                      >
                        <span>
                          {options.plugins.record.audio ? <AiOutlineAudio /> : <AiOutlineAudioMuted />}
                        </span>
                        <span>
                          {options.plugins.record.audio
                            ? intl.formatMessage({ id: 'mute', defaultMessage: 'Mute' })
                            : intl.formatMessage({ id: 'unmute', defaultMessage: 'Unmute' })}
                        </span>
                      </Button>
                      <Button
                        disabled={cameraList.length < 2 || isRecording}
                        className={styles['recorder-btn-item']}
                        onClick={() => handelChangeCamera()}
                      >
                        <span><AiOutlineSwap /></span>
                        <span>{intl.formatMessage({ id: 'swap', defaultMessage: 'Swap' })}</span>
                      </Button>
                      <Button
                        disabled={!isRecording}
                        className={styles['recorder-btn-item']}
                        onClick={() => handelTooglePause()}
                      >
                        <span>
                          {isPause ? <AiOutlinePlayCircle /> : <AiOutlinePauseCircle />}
                        </span>
                        <span>
                          {isPause
                            ? intl.formatMessage({ id: 'resume', defaultMessage: 'Resume' })
                            : intl.formatMessage({ id: 'pause', defaultMessage: 'Pause' })}
                        </span>
                      </Button>
                      <Button
                        disabled={!isRecording}
                        className={styles['recorder-btn-item']}
                        onClick={() => {
                          if (isRecording && videoRecorderRef.current) {
                            videoRecorderRef.current.record().stop();
                          }
                        }}
                      >
                        <span><AiOutlineBorder /></span>
                        <span>{intl.formatMessage({ id: 'stop', defaultMessage: 'Stop' })}</span>
                      </Button>
                      <Button
                        disabled={!isRecording}
                        className={styles['recorder-btn-item']}
                        onClick={handelReset}
                      >
                        <span><AiOutlineUndo /></span>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>
      <RecordModalDeleted isDeleted={isDeleted} onClick={handleClickInDelModel} />
    </>
  );
}

export default RecordModal;
