'use client';

import BookmarkButton from '@components/action-buttons/bookmark-button';
import CommentButton from '@components/action-buttons/comment-button';
import LikeButton from '@components/action-buttons/like-button';
import CommentWrapper from '@components/comment/comment-wrapper';
import VideoDetailPlayer from '@components/video/details/video-player';
import { IAdvertisement } from '@interfaces/advertisement';
import { useState } from 'react';
import { InView } from 'react-intersection-observer';
import { advertisementService } from '@services/advertisement.service';
import Link from 'next/link';
import { useIntl } from 'react-intl';
import styles from './adCard.module.scss';

interface IProps {
  feed: IAdvertisement
}
export default function AdCard({ feed }: IProps) {
  const [openComment, setOpenComment] = useState(false);
  const intl = useIntl();
  const onView = async (inView: boolean) => {
    inView && await advertisementService.views(feed._id);
  };

  return (
    <InView onChange={onView}>
      <div className={styles['adCard-wrapper']}>
        <header className={styles['adCard-header']}>
          <div className={styles['adCard-header-brand']}>
            <img src={feed?.creator?.avatar || '/no-avatar.jpg'} alt="" />
            <div>
              <h4>{feed.creator.name}</h4>
              <p>
                @
                {feed.creator.username}
              </p>
            </div>
          </div>
          <div className={styles['adCard-header-icon']}>
            {intl.formatMessage({ id: 'ad', defaultMessage: 'AD' })}
          </div>
        </header>
        <div className={styles['adCard-content']}>
          <p className={styles['adCard-content-title']}>{feed.title}</p>
          <p className={styles['adCard-content-description']}>{feed.description}</p>
          {(feed as any).redirectLink
            && (
              <div className={styles['adCard-content-redirectLink']}>
                <p>
                  {intl.formatMessage({ id: 'redirectLink', defaultMessage: 'Redirect Link:' })}
                </p>
                <Link href={(feed as any).redirectLink} target="blank">{(feed as any).redirectLink}</Link>
              </div>
            )}
          {feed?.isAd && feed?.redirectLink.length
            ? (
              <Link href={(feed as any).redirectLink} className={styles['adCard-content-media']}>
                <VideoDetailPlayer video={feed as any} />
              </Link>
            )
            : (
              <div className={styles['adCard-content-media']}>
                <VideoDetailPlayer video={feed as any} />
              </div>
            )}
        </div>
        <footer className={styles['adCard-footer']}>
          <div className={styles['adCard-footer-left']}>
            <LikeButton
              objectId={feed._id}
              objectType="advertisement"
              displayType="feed"
              liked={feed.isLiked}
              totalLike={feed.stats.likes}
            />
            <CommentButton
              totalComment={feed.stats.comments}
              active={openComment}
              onClick={() => setOpenComment(!openComment)}
            />
          </div>
          <div className={styles['adCard-footer-right']}>
            <BookmarkButton
              objectId={feed._id}
              objectType="advertisement"
              bookmarked={feed.isBookMarked}
            />
          </div>
        </footer>
        {openComment && (
          <div className="feed-comment">
            <CommentWrapper objectId={feed._id} objectType="advertisement" />
          </div>
        )}
      </div>
    </InView>
  );
}
