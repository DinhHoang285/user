'use client';

import { AiOutlineLock, AiOutlineUnlock } from 'react-icons/ai';
import { getThumbnail } from '@lib/index';
import { Button, Tooltip } from 'antd';
import { useIntl } from 'react-intl';
import { IFeed, IPerformer } from 'src/interfaces';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ImageWithFallback from '@components/common/images/image-fallback';
import style from './grid-card.module.scss';

interface IProps {
  feed: IFeed;
}

function FeedGridCard({ feed }: IProps) {
  const intl = useIntl();
  const { data: session } = useSession();
  const user: IPerformer = session?.user as IPerformer;
  const router = useRouter();
  let canView = (!feed.isSale && feed.isSubscribed)
    || feed.isBought
    || feed.type === 'text'
    || (feed.isSale && !feed.price);

  if (
    !user._id
    || (`${user._id}` !== `${feed.fromSourceId}` && user.isPerformer)
  ) {
    canView = false;
  }
  const images = feed.files && feed.files.filter((f) => f.type === 'feed-photo');
  const videos = feed.files && feed.files.filter((f) => f.type === 'feed-video');
  const thumbUrl = canView
    ? feed?.thumbnail?.url
    || (images && images[0] && images[0]?.url)
    || (videos
      && videos[0]
      && videos[0].thumbnails
      && videos[0].thumbnails[0])
    || (feed?.teaser && feed?.teaser?.thumbnails && feed?.teaser?.thumbnails[0])
    : getThumbnail(feed, '/leaf.jpg');

  return (
    <div
      aria-hidden
      onClick={() => router.push(
        `/post/${feed.slug || feed._id}`
      )}
      className={style['feed-grid-card']}
      key={feed._id}
    >
      <Tooltip title={feed.text || ''}>
        <ImageWithFallback
          options={{
            unoptimized: true,
            with: 750,
            height: 750,
            quality: 50,
            sizes: '(max-width: 767px) 100vw, (min-width: 768px) 20vw',
            style: { filter: !canView ? 'blur(20px)' : 'blur(0px)' }
          }}
          alt="post"
          src={thumbUrl}
          fallbackSrc="/leaf.jpg"
        />
        <div className={style['card-middle']}>
          {canView ? <AiOutlineUnlock /> : <AiOutlineLock />}
          {!feed.isSale && !feed.isSubscribed && (
            <Button type="link">
              {intl.formatMessage({ id: 'subscribeToUnlock', defaultMessage: 'Subscribe to unlock' })}
            </Button>
          )}
          {feed.isSale && !feed.isBought && (
            <Button type="link">
              {intl.formatMessage({ id: 'payNowToUnblock', defaultMessage: 'Pay now to unlock' })}
            </Button>
          )}
        </div>
      </Tooltip>
      <div className={style['card-bottom']}>
        <p>{feed.title || feed.text}</p>
      </div>
    </div>
  );
}

export default FeedGridCard;
