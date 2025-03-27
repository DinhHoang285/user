'use client';

import Image from 'next/image';
import {
  useEffect, useRef, useState
} from 'react';
import { useInView } from 'react-intersection-observer';
import dynamic from 'next/dynamic';
import { useMainThemeLayout } from 'src/providers/main-layout.provider';
import { AiOutlinePlayCircle } from 'react-icons/ai';
import style from './index.module.scss';

const PlayerControls = dynamic(() => import('./controls'), { ssr: false });

interface P {
  videoSrc: string;
  videoId?: string;
  thumbUrl?: string;
  classes?: string;
  priority?: boolean;
  aspectRatio?: any;
  playInview?: boolean;
}

export default function HtmlVideolayer({
  videoSrc,
  videoId = '',
  thumbUrl = '',
  classes = '',
  priority = false,
  aspectRatio = 16 / 9,
  playInview = true
}: P) {
  const playerRef = useRef(null);
  const [preInview, setPreInview] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const played = useRef(false);
  const { ref, inView } = useInView({
    threshold: 0.7
  });
  const {
    setVolume, volume, autoPlayVideo, setAutoPlayVideo
  } = useMainThemeLayout();

  useEffect(() => {
    if (playerRef.current) {
      const onChangePlay = (e) => {
        if (e.type === 'pause') {
          setIsPlaying(false);
        }
        if (e.type === 'play') {
          setTimeout(() => {
            setIsPlaying(true);
          }, 300);
          played.current = true;
        }
      };
      playerRef.current.onplay = onChangePlay;
      playerRef.current.onpause = onChangePlay;
    }
  }, []);

  useEffect(() => {
    const { current } = playerRef;
    if (inView && playInview) {
      setTimeout(() => {
        setPreInview(true);
      }, 350);
    } else {
      setPreInview(false);
    }
    if (current) {
      if (current.paused && inView && preInview) {
        current.volume = volume || 0;
        current.muted = volume === 0;
        playInview && current.paused && current.play();
      } else {
        current.played && current.pause();
      }
    }
  }, [inView, preInview]);

  useEffect(() => {
    playerRef.current.src = videoSrc;
    inView && playerRef.current.play();
  }, [videoSrc]);

  return (
    <div
      ref={ref}
      className={`
        ${style['vid-ctn']}
        ${classes}`}
    >
      {thumbUrl && !played.current && !isPlaying && (
        <div
          className="vid-poster"
          onClick={() => {
            playerRef.current.play();
          }}
          aria-hidden
        >
          <Image
            quality={50}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 2100px) 20vw"
            priority={priority}
            loading={priority ? 'eager' : 'lazy'}
            src={thumbUrl}
            alt="thumb-video"
          />
          <span>
            <AiOutlinePlayCircle />
          </span>
        </div>
      )}
      <video
        id={`video_player_${videoId}`}
        width="100%"
        height="auto"
        loop={false}
        playsInline
        controls={false}
        preload="auto"
        ref={playerRef}
        style={{ aspectRatio: `${aspectRatio}` }}
        onEnded={(isPlayed) => {
          if (isPlayed && autoPlayVideo.autoPlayBtn === 'on' && videoId) {
            setAutoPlayVideo({ currentIdRunning: videoId });
          }
        }}
      >
        <source
          src={videoSrc}
          type="video/mp4"
        />
      </video>
      {playerRef.current && (
        <PlayerControls
          playerRef={playerRef.current}
          isPlaying={isPlaying}
          setVolume={setVolume}
          volume={volume}
        />
      )}
    </div>
  );
}
