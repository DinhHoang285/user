'use client';

import { AiOutlineCalendar, AiOutlineLock, AiOutlineUnlock } from 'react-icons/ai';
import { Tooltip } from 'antd';
import Link from 'next/link';
import { useState } from 'react';
import { IMedia } from 'src/interfaces';
import { useIntl } from 'react-intl';
import { getCanView } from '@lib/media';
import ImageWithFallback from '@components/common/images/image-fallback';
import style from './MediaGridCard.module.scss';

interface IProps {
  media: IMedia;
  isPageBookmark?: boolean
}

function MediaGridCard({ media, isPageBookmark = false }: IProps) {
  if (!media) return null;

  const intl = useIntl();
  const [isHovered, setIsHovered] = useState(false);

  const getThumb = (): string => {
    let url;
    if (media) {
      switch (media.mediaType) {
        case 'video':
        case 'short':
          url = (media?.thumbnail?.thumbnails && media?.thumbnail?.thumbnails[0])
            || (media?.teaser?.thumbnails && media?.teaser?.thumbnails[0])
            || (media?.video?.thumbnails && media?.video?.thumbnails[0])
            || '/leaf.jpg';
          break;
        case 'gallery':
          url = media?.coverPhoto?.thumbnails ? media?.coverPhoto?.thumbnails[0]
            : '/leaf.jpg';
          break;
        case 'product':
          url = media?.image || '/no-image.jpg';
          break;
        default:
          // eslint-disable-next-line no-case-declarations
          const images = media.files && media.files.filter((f) => ['feed-photo'].includes(f.type));
          // eslint-disable-next-line no-case-declarations
          const videos = media.files && media.files.filter((f) => ['feed-video', 'performer-video'].includes(f.type));
          url = media?.thumbnail?.thumbnails?.[0]
            ?? images?.[0]?.thumbnails?.[0]
            ?? videos?.[0]?.thumbnails?.[0]
            ?? '/leaf.jpg';
          break;
      }
    }
    return url;
  };

  const canView: boolean = getCanView(media, !!media.isBought);
  const thumbUrl = getThumb();

  return (
    <Link href={`/post/${media.slug}`}>
      <div
        className={style['media-card']}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {((media.isSale && media.price > 0) || (media.mediaType === 'product' && media.price > 0)) && (
          <span className={style['media-price']}>
            <div className={style['label-price']}>
              €
              {(media.price || 0).toFixed(2)}
            </div>
          </span>
        )}
        {!media.stock && media.type === 'physical' && media.mediaType === 'product' && (
          <span className={style['media-digital']}>
            <div className={style['label-digital']}>
              {intl.formatMessage({
                id: 'outOfStock',
                defaultMessage: 'Out of stock!'
              })}
            </div>
          </span>
        )}
        {media.stock > 0 && media.type === 'physical' && media.mediaType === 'product' && (
          <span className={style['media-digital']}>
            <div className={style['label-digital']}>
              {Math.round(media.stock)}
              {' '}
              {intl.formatMessage({
                id: 'inStock',
                defaultMessage: 'in stock'
              })}
            </div>

          </span>
        )}
        {media.type === 'digital' && media.mediaType === 'product' && (
          <span className={style['media-digital']}>
            <span className={style['label-digital']}>
              {intl.formatMessage({
                id: 'digital',
                defaultMessage: 'Digital'
              })}
            </span>
          </span>
        )}
        {media.isSchedule && (
          <span className={style['media-calendar']}>
            <AiOutlineCalendar />
          </span>
        )}
        <div className={style['media-thumb']}>
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
            src={isPageBookmark && media.type === 'audio' ? '/audio-paused.jpg' : thumbUrl}
            fallbackSrc="/no-image.jpg"
          />

          {
            !canView
            && (
              <div className={style['lock-middle']}>
                {(canView || isHovered) ? <AiOutlineUnlock /> : <AiOutlineLock />}
              </div>
            )
          }
        </div>
        <Tooltip title={media.title || media.name || media.text}>
          <div className={style['media-info']}>
            {media.title || media.name || media.text}
          </div>
        </Tooltip>
      </div>
    </Link>
  );
}

export default MediaGridCard;
