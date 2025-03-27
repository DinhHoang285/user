'use client';

import {
  useState, useRef, useEffect, ChangeEvent,
  KeyboardEvent
} from 'react';
import {
  AiOutlineMuted,
  AiOutlinePauseCircle,
  AiOutlinePlayCircle,
  AiOutlineSound
} from 'react-icons/ai';
import { Tooltip } from 'antd';
import { useIntl } from 'react-intl';
import { usePathname } from 'next/navigation';
import styles from './audio-player.module.scss';

interface IProps {
  url: string;
  thumbnailUrl?: string;
}

export default function AudioPlayer({ url, thumbnailUrl = '/logo.png' }: IProps) {
  const intl = useIntl();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const pathName = usePathname();

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

  const handleCanPlayThrough = () => {
    if (audioRef.current) {
      const audioDuration = audioRef.current.duration;
      if (Number.isNaN(audioDuration) || audioDuration === Infinity) {
        // eslint-disable-next-line no-console
        console.log('Unable to determine duration.');
      } else {
        setDuration(audioDuration);
      }
    }
  };

  const handleProgressChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = Number(e.target.value);
      audioRef.current.currentTime = (audioRef.current.duration / 100) * newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
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

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      isPlaying ? handlePause() : handlePlay();
    }
  };

  return (
    <>
      {pathName.includes('/post') && (
        <div className={styles['box-thumbnail-page-post']}>
          <img src={thumbnailUrl} loading="lazy" alt="Audio Thumbnail" />
        </div>
      )}
      <div className={`${styles['audio-wrapper']} ${pathName.includes('/post') ? styles['page-post'] : ''}`}>
        <div className={styles['box-thumbnail']}>
          <img src={thumbnailUrl} loading="lazy" alt="Audio Thumbnail" />
        </div>
        {!pathName.includes('/post') && (
          <div
            className={`show-mobile ${styles['box-play']}`}
            onClick={isPlaying ? handlePause : handlePlay}
            role="button"
            tabIndex={0}
            onKeyDown={handleKeyDown}
          >
            {isPlaying ? <AiOutlinePauseCircle /> : <AiOutlinePlayCircle />}
          </div>
        )}
        <div className={styles['box-audio']}>
          <audio
            ref={audioRef}
            src={url}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleAudioLoaded}
            onCanPlayThrough={handleCanPlayThrough}
          />
          <div className={styles['audio-action']}>
            <div
              className={styles['audio-btn']}
              onClick={isPlaying ? handlePause : handlePlay}
              role="button"
              tabIndex={0}
              onKeyDown={handleKeyDown}
            >
              {isPlaying ? <AiOutlinePauseCircle /> : <AiOutlinePlayCircle />}
            </div>
            <Tooltip
              placement="topLeft"
              title={(
                <div className={styles['audio-volumn-wrapper']}>
                  <div className={styles['audio-volumn-label']}>
                    <span>
                      {intl.formatMessage({ id: 'volumn', defaultMessage: 'Volume' })}
                      :
                    </span>
                  </div>
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
              <div className={styles['audio-volume']}>
                {Number(volume) === 0 ? <AiOutlineMuted /> : <AiOutlineSound />}
              </div>
            </Tooltip>
            <input
              type="range"
              step="0.01"
              min="0"
              max={duration}
              value={currentTime}
              onChange={handleProgressChange}
            />
            <div className={styles['audio-timer']}>
              <span>{Math.floor(currentTime / 60).toString().padStart(2, '0')}</span>
              <span>:</span>
              <span>{Math.floor(currentTime % 60).toString().padStart(2, '0')}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
