'use client';

import { AiOutlineLock, AiOutlineUnlock } from 'react-icons/ai';
import { Image } from 'antd';
import Link from 'next/link';
import { IFeed } from 'src/interfaces';
import style from './trending.module.scss';

interface IProps {
  feed: IFeed;
}
function CardFeedTrending({ feed }: IProps) {
  const canView = (!feed.isSale && feed.isSubscribed) || (feed.isSale && feed.isBought);
  const images = feed.files && feed.files.filter((f) => f.type === 'feed-photo');
  const videos = feed.files && feed.files.filter((f) => f.type === 'feed-video');
  const thumbUrl = (images
    && images[0]
    && images[0]?.thumbnails
    && images[0]?.thumbnails[0])
    || (videos
      && videos[0]
      && videos[0]?.thumbnails
      && videos[0]?.thumbnails[0]) || '/leaf.jpg';
  return (
    <div className={style['feed-trending-grid-card']} key={feed._id}>
      <Link
        href={`/post/${feed.slug || feed._id}`}
      >
        <div className={style['card-trending-thumb']}>
          <div
            className={style['trending-card-bg']}
            style={{
              backgroundImage: `url(${thumbUrl})`,
              filter: !canView ? 'blur(20px)' : 'blur(0px)'
            }}
          />
          {feed.isSale && feed.price > 0 && (
            <div className={style['trending-bagde']}>
              <p className={style['trending-category-bg']}>
                €
                {' '}
                {(feed.price || 0).toFixed(2)}
              </p>
            </div>
          )}
          <div className={style['card-middle']}>
            <span>
              {canView ? <AiOutlineUnlock /> : <AiOutlineLock />}
            </span>
          </div>
          <div className={style['card-bottom']}>
            <div className={style['stats-profile']}>
              <Image
                preview={false}
                alt="main-avt"
                src={feed.performer?.avatar || '/no-avatar.jpg'}
                fallback="/no-avatar.jpg"
              />
              <h5>{(feed.performer && feed.performer?.username) || 'n/a'}</h5>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default CardFeedTrending;
