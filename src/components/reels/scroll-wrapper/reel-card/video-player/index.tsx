/* eslint-disable @typescript-eslint/no-unused-vars */
// import Image from 'next/image';
import {
  useEffect, useRef, useState
} from 'react';
import { RiPlayFill, RiLoader2Line } from 'react-icons/ri';

interface P {
  videoSrc: string;
  thumbUrl: string;
  aspectRatio: number;
  volume: number;
  inView: boolean;
}

export default function Reellayer({
  videoSrc,
  thumbUrl,
  aspectRatio,
  volume = 1,
  inView
}: P) {
  const playerRef = useRef(null);
  const playbackRef = useRef(null);
  const [playbackPercentage, setPercentage] = useState(0);
  const [canPlay, setCanPlay] = useState(false);

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.volume = volume || 1;
      playerRef.current.muted = !volume;
      if (inView && canPlay) {
        playerRef.current.play();
      } else {
        playerRef.current.pause();
      }
    }
  }, [inView, volume, canPlay]);

  return (
    <div
      className="reel-player"
    >
      {/* {thumbUrl && !playbackPercentage && playerRef.current?.paused && <Image unoptimized src={thumbUrl} style={{ objectFit: 'cover' }} alt="thumb-reel" fill />} */}
      <video
        width="100%"
        height="auto"
        loop
        playsInline
        controls={false}
        preload="auto"
        onTimeUpdate={() => {
          const { currentTime = 0, duration = 0 } = playerRef.current;
          setPercentage((currentTime / duration) * 100);
        }}
        onCanPlayThrough={() => { setCanPlay(true); }}
        onEnded={() => { setPercentage(0); }}
        ref={playerRef}
        style={{ aspectRatio }}
        aria-hidden
        onClick={() => {
          playerRef.current.paused ? playerRef.current.play() : playerRef.current.pause();
        }}
      >
        <source
          src={videoSrc}
          type="video/mp4"
        />
      </video>
      <button
        aria-label="pause"
        type="button"
        className={playerRef?.current?.paused ? 'pause-btn active' : 'pause-btn'}
        onClick={() => {
          playerRef.current.play();
        }}
      >
        {!canPlay ? <RiLoader2Line className="loader" /> : <RiPlayFill />}
      </button>
      <div
        ref={playbackRef}
        aria-hidden
        className="playback-line"
        onClick={(e: any) => {
          const { clientWidth } = playbackRef.current;
          const { duration: currentDudation } = playerRef.current;
          playerRef.current.currentTime = (e.nativeEvent.offsetX / clientWidth) * currentDudation;
        }}
      >
        <div className="progress-bar" style={{ width: `${playbackPercentage}%` }} />
      </div>
    </div>

  );
}
