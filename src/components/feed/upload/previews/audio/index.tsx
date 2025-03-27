import React, { useState, useRef, useEffect } from 'react';
import { AiOutlinePlayCircle, AiOutlineMuted, AiOutlinePauseCircle } from 'react-icons/ai';
import { Tooltip } from 'antd';
import { useIntl } from 'react-intl';
// import { showError } from '@lib/message';

import styles from './index.module.scss';

interface IProps {
  url: string,
  inModal?: boolean
}

function PreviewAudio({ url, inModal = false }: IProps) {
  const intl = useIntl();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleAudioLoaded = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // const handleCanPlayThrough = () => {
  //   if (audioRef.current) {
  //     const audioDuration = audioRef.current.duration;
  //     if (Number.isNaN(!audioDuration) || audioDuration === Infinity) {
  //       showError('Unable to determine duration.');
  //     } else {
  //       setDuration(audioDuration);
  //     }
  //     console.log('data', audioDuration);
  //   }
  // };

  const handleProgressChange = (e) => {
    const newTime = e.target.value;
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  return (
    <div className={`${styles['preview-wrapper']} ${inModal ? styles['in-modal'] : ''}`}>
      <audio
        preload="metadata"
        ref={audioRef}
        src={url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleAudioLoaded}
        // onCanPlayThrough={handleCanPlayThrough}
      />
      <div className={styles['preview-play']}>
        <div
          className={styles['preview-play-btn']}
          onClick={isPlaying ? handlePause : handlePlay}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              isPlaying ? handlePause() : handlePlay();
            }
          }}
        >
          {isPlaying ? <AiOutlinePauseCircle /> : <AiOutlinePlayCircle />}
        </div>
      </div>
      <div className={styles['preview-action']}>
        <p className={styles['preview-timer']}>
          {Math.floor(currentTime / 60).toString().padStart(2, '0')}
          :
          {(Math.floor(currentTime % 60)).toString().padStart(2, '0')}
        </p>
        <input
          className={styles['preview-progress']}
          type="range"
          min="0"
          max={Number.isNaN(duration) ? '0' : duration.toString()}
          value={currentTime}
          onChange={handleProgressChange}
        />
        <Tooltip
          placement="topLeft"
          title={(
            <div className={styles['preview-volumn-wrapper']}>
              <p className={styles['preview-volumn-label']}>
                {intl.formatMessage({ id: 'volumn', defaultMessage: 'Volumn' })}
                :
              </p>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
              />
            </div>
          )}
        >
          <p className={styles['preview-volumn']}>
            <AiOutlineMuted />
          </p>
        </Tooltip>
      </div>
    </div>
  );
}

export default PreviewAudio;
