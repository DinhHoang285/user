'use client';

import BookmarkButton from '@components/action-buttons/bookmark-button';
import CommentButton from '@components/action-buttons/comment-button';
import LikeButton from '@components/action-buttons/like-button';
import CommentWrapper from '@components/comment/comment-wrapper';
import TipPerformerButton from '@components/performer/tip/tip-btn';
import ReportBtn from '@components/report/report-btn';
import { IPerformer } from '@interfaces/performer';
import { formatDate } from '@lib/date';
import { getCanView } from '@lib/media';
import classNames from 'classnames';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  useMemo,
  useState
} from 'react';
import withHydrationOnDemand from 'react-hydration-on-demand';
import { AiFillPushpin, AiFillStar, AiOutlineCheck } from 'react-icons/ai';
import { useMainThemeLayout } from 'src/providers/main-layout.provider';
import ImageWithFallback from '@components/common/images/image-fallback';
import DropdownActions from '../dropdown-actions';
import style from './MediaCard.module.scss';

const FeedPolls = dynamic(() => import('@components/feed/cards/card-container/post-polls-list'));
const ContentMiddle = dynamic(() => import('@components/media/container/content-middle'));
const LockContentMiddle = dynamic(() => import('@components/media/container/lock-content-middle'));

const ReportBtnHydration = withHydrationOnDemand({ on: ['idle', 'visible'] })(
  ReportBtn
);
const BookmarkButtonHydration = withHydrationOnDemand({ on: ['idle', 'visible'] })(
  BookmarkButton
);
const CommentButtonHydration = withHydrationOnDemand({ on: ['idle', 'visible'] })(
  CommentButton
);
const LikeButtonHydration = withHydrationOnDemand({ on: ['idle', 'visible'] })(
  LikeButton
);
const TipPerformerButtonHydration = withHydrationOnDemand({ on: ['idle', 'visible'] })(
  TipPerformerButton
);

interface IProps {
  feed: any,
  performer?: IPerformer,
  isPageBookmark?: boolean;
  onPin?: Function;
}

export default function MediaCard({
  feed, performer,
  isPageBookmark,
  onPin
}: IProps) {
  const { data: session } = useSession();
  const user = session?.user as any;
  const [isBought, setIsBought] = useState(feed?.isBought);
  const { setLoginModal, setAutoPlayVideo } = useMainThemeLayout();
  const [openComment, setOpenComment] = useState(false);

  const onPaymentSuccess = (data) => {
    // TODO refetch url video if S3
    if (!data || data?.products[0]?.productId !== feed?._id || isBought) return;
    setIsBought(true);
  };

  const canView = useMemo(() => getCanView(feed, isBought), [feed, isBought]);

  return (
    <div id={feed?._id} className={style['media-card']}>
      <div className={style['media-top']}>
        <Link href={`/${performer?.username || performer?._id}`}>
          <div className={style['media-top-left']}>
            <ImageWithFallback
              options={{
                width: 40,
                height: 40,
                quality: 30,
                sizes: '(max-width: 767px) 10vw, (min-width: 768px) 5vw'
              }}
              alt="per_atv"
              fallbackSrc="/no-avatar.jpg"
              src={performer?.avatar || '/no-avatar.jpg'}
            />
            <div className={style['media-name']}>
              <div className={style.name}>
                {performer?.name || 'N/A'}
                {' '}
                {performer?.verifiedAccount && (
                  <AiOutlineCheck style={{ color: '#29ABE2' }} />
                )}
                &nbsp;
                {performer?.isFeatured && (
                  <AiFillStar style={{ color: '#29ABE2' }} />
                )}
              </div>
              <div className={style.username}>
                @
                {performer?.username || 'n/a'}
              </div>
            </div>
            <span className={classNames({
              [style['online-status']]: true,
              [style.active]: performer?.isOnline
            })}
            />
          </div>
        </Link>
        <div className={style['media-top-right']}>
          <span className={style['media-pin']}>
            {feed?.isPinned && (
              <AiFillPushpin />
            )}
          </span>
          <span className={style['media-time']}>{formatDate(feed?.updatedAt, 'MMM DD')}</span>
          <DropdownActions media={feed} onPin={onPin} />
        </div>
      </div>
      <div className={style['media-container']}>
        <Link href={`/post/${feed?.slug || feed?._id}`} className={style['media-title']}>
          {feed?.title}
        </Link>
        <div className={style['media-text']}>
          {feed?.text || feed?.description}
          <span>
            {feed?.tags && feed?.tags.length > 0 && (
              // eslint-disable-next-line react/jsx-no-useless-fragment
              <>
                {feed?.tags.map((tag) => (
                  <span key={tag}>
                    #
                    {tag || 'tag'}
                  </span>
                ))}
              </>
            )}
          </span>
        </div>
        {feed?.polls?.length > 0 && <FeedPolls feed={feed} user={user} />}
        {feed?.type !== 'text' && (
          <div>
            {canView ? (
              <ContentMiddle
                feed={feed}
              />
            ) : (
              <LockContentMiddle
                onPaymentSuccess={onPaymentSuccess}
                feed={feed}
              />
            )}
          </div>
        )}
      </div>
      <div className="feed-bottom">
        <div className={style['media-actions']}>
          <div className={style['action-item']}>
            <LikeButtonHydration
              objectId={feed?._id}
              objectType={feed?.mediaType === 'short' ? 'reel' : feed?.mediaType}
              displayType="feed"
              performerId={feed?.performer?._id}
              totalLike={feed?.totalLike || feed?.stats?.likes || 0}
              liked={feed?.isLiked}
            />
            <CommentButtonHydration
              totalComment={feed?.totalComment || feed?.stats?.comments || 0}
              active={openComment}
              onClick={() => {
                setAutoPlayVideo({ autoPlayBtn: 'off' });
                if (!user?._id) {
                  setLoginModal({ openForm: 'login' });
                } else {
                  setOpenComment(!openComment);
                }
              }}
            />
            {performer ? <TipPerformerButtonHydration performer={performer} /> : null}
          </div>
          <div className={style['action-item']}>
            <ReportBtnHydration
              target={feed?.type}
              targetId={feed?._id}
              performer={performer}
            />
            <BookmarkButtonHydration
              objectId={feed?._id}
              objectType={feed?.type}
              bookmarked={isPageBookmark ? true : feed?.isBookMarked}
            />
          </div>
        </div>
        {openComment && (
          <div className="feed-comment">
            <CommentWrapper
              objectId={feed?._id}
              objectType={feed?.type}
            />
          </div>
        )}
      </div>
    </div>
  );
}
