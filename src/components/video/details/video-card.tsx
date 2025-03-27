'use client';

import { AiOutlineCalendar, AiOutlineLock, AiOutlineUnlock } from 'react-icons/ai';
import { Tooltip } from 'antd';
import Link from 'next/link';
import { useState } from 'react';
import { IVideo } from 'src/interfaces';
import classNames from 'classnames';
import ImageWithFallback from '@components/common/images/image-fallback';
import style from './video-card.module.scss';

interface IProps {
  video: IVideo;
}

export default function VideoCard({ video }: IProps) {
  const [isHovered, setIsHovered] = useState(false);
  const canView = (!video.isSale && video.isSubscribed) || (video.isSale && video.isBought);

  const thumbUrl = (canView ? video?.thumbnail?.url : (video?.thumbnail?.thumbnails && video?.thumbnail?.thumbnails[0])) || (video?.teaser?.thumbnails && video?.teaser?.thumbnails[0]) || (video?.video?.thumbnails && video?.video?.thumbnails[0]) || '/no-image.jpg';
  return (
    <Link
      href={`/video/${video.slug || video._id}`}
    >
      <div
        className={classNames(style['vid-card'])}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {video.isSale && video.price > 0 && (
          <span className={style['vid-price']}>
            <div className={style['label-price']}>
              €
              {(video.price || 0).toFixed(2)}
            </div>
          </span>
        )}
        {video.isSchedule && (
          <span className={style['vid-calendar']}>
            <AiOutlineCalendar />
          </span>
        )}
        <div className={style['vid-thumb']}>
          <ImageWithFallback
            options={{
              unoptimized: true,
              width: 250,
              height: 250,
              quality: 70,
              sizes: '(max-width: 768px) 30vw, (max-width: 2100px) 20vw',
              className: style['card-bg'],
              style: { filter: !canView ? 'blur(20px)' : 'blur(0px)' }
            }}
            alt="thumb"
            src={thumbUrl}
            fallbackSrc="/no-image.jpg"
          />
          {
            !canView
            && (
              <div className={style['lock-middle']}>
                <span>
                  {(canView || isHovered) ? <AiOutlineUnlock /> : <AiOutlineLock />}
                </span>
              </div>
            )
          }
        </div>
        <Tooltip title={video.title}>
          <div className={style['vid-info']}>
            {video.title}
          </div>
        </Tooltip>
      </div>
    </Link>
  );
}
