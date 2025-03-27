/* eslint-disable no-param-reassign */

'use client';

import { useEffect, useRef, useState } from 'react';
import { FaPlay } from 'react-icons/fa';
import {
  AiOutlineSound, AiOutlinePause, AiOutlineExpand, AiOutlineMuted
} from 'react-icons/ai';
import { videoDuration } from '@lib/duration';

interface IControls {
  isPlaying: boolean;
  playerRef: any;
  setVolume: Function;
  volume: number;
}

export default function PlayerControls({
  isPlaying, playerRef, setVolume, volume
}: IControls) {
  const [time, setTime] = useState(0);
  const [playbackPercentage, setPercentage] = useState(0);
  const playbackRef = useRef(null);
  const volumeRef = useRef(null);

  useEffect(() => {
    playerRef.volume = 0;
    playerRef.muted = true;
    // playerRef.onvolumechange = onChangeVolume;
    playerRef.ontimeupdate = () => {
      const { currentTime, duration: currentDudation } = playerRef;
      setTime(currentTime);
      setPercentage((currentTime / currentDudation) * 100);
    };
    playerRef.onended = setPercentage(0);
    // Listening volume change
    volumeRef.current.addEventListener('input', () => {
      playerRef.volume = volumeRef.current.value;
      playerRef.muted = playerRef.volume === 0;
      setVolume({ volume: playerRef.volume });
    });
  }, []);

  if (volumeRef.current) {
    volumeRef.current.value = volume;
  }

  return (
    <div className="controls">
      <button
        type="button"
        onClick={() => {
          if (isPlaying) {
            playerRef.pause();
          } else {
            playerRef.play();
          }
        }}
      >
        <span>{isPlaying ? <AiOutlinePause /> : <FaPlay />}</span>
      </button>
      <div className="video-timer">
        <span id="current-time">{videoDuration(time)}</span>
        <span className="separator">/</span>
        <span id="max-duration">{videoDuration(playerRef?.duration || 0)}</span>
      </div>
      <div
        ref={playbackRef}
        aria-hidden
        className="playback-line"
        onClick={(e: any) => {
          const { clientWidth } = playbackRef.current;
          const { duration: currentDudation } = playerRef;
          playerRef.currentTime = (e.nativeEvent.offsetX / clientWidth) * currentDudation;
        }}
      >
        <div className="progress-bar" style={{ width: `${playbackPercentage}%` }} />
      </div>
      <div className="volume-container">
        <button
          type="button"
          onClick={() => {
            const { muted } = playerRef;
            setVolume({ volume: muted ? 1 : 0 });
            playerRef.volume = muted ? 1 : 0;
            playerRef.muted = !muted;
          }}
        >
          <span>{volume === 0 ? <AiOutlineMuted /> : <AiOutlineSound />}</span>
        </button>
        <div className="volume">
          <input
            ref={volumeRef}
            type="range"
            className="volume"
            min="0"
            max="1"
            step="0.01"
          />
        </div>
      </div>
      <button
        aria-label="fullscreen"
        type="button"
        onClick={() => {
          if (playerRef.webkitSupportsFullscreen) {
            playerRef.webkitEnterFullscreen();
            return;
          }
          playerRef.requestFullscreen();
        }}
      >
        <span><AiOutlineExpand /></span>
      </button>
    </div>
  );
}
