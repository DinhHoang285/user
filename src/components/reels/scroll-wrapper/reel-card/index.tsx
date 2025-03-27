'use client';

import Price from '@components/common/price';
import { IFeed } from '@interfaces/feed';
import { IUser } from '@interfaces/user';
import { feedService } from '@services/feed.service';
import { Button } from 'antd';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { AiOutlineLock } from 'react-icons/ai';
import { useInView } from 'react-intersection-observer';
import { useIntl } from 'react-intl';
import { useMainThemeLayout } from 'src/providers/main-layout.provider';
import style from './style.module.scss';

const ModelBox = dynamic(() => import('./model-box'), { ssr: false });
const CommentsReelWrapper = dynamic(() => import('./comments-wrapper'), { ssr: false });
const PurchaseReelsForm = dynamic(() => import('./confirm-purchase'), { ssr: false });
const RightMenuWrapper = dynamic(() => import('./right-group-buttons'));
const ReelPlayer = dynamic(() => import('./video-player'));
const FooterLeft = dynamic(() => import('./footer'));

interface IProps {
  item: IFeed;
  idx: number;
  total: number;
  onView: Function;
}

export default function ReelCard({
  item,
  idx,
  total,
  onView
}: IProps) {
  const intl = useIntl();
  const [viewProfile, setViewProfile] = useState(false);
  const [openComment, setOpenComment] = useState(false);
  const { data: session } = useSession();
  const user: IUser = session?.user as IUser;
  const video = item.files[0];
  const { ref, inView } = useInView({
    threshold: 0.8
  });
  const viewed = useRef(false);
  const performer = item.performer || (item as any).admin;
  const { setLoginModal, volume, setVolume } = useMainThemeLayout();

  const [action, setAction] = useState({
    openModel: false,
    comment: false,
    isBought: item.isBought,
    isSubscribed: item.isSubscribed
  });

  const viewable = (
    item.isFree
    || (item.isSub && action.isSubscribed)
    || (item.isSale && item.price && action.isBought)
    || (item.isSale && !item.price)
    || (performer?._id === user?._id)
    || (item as any).isAd
  );

  const onOpenModel = () => {
    if (user?._id) {
      setAction((prev) => ({ ...prev, openModel: true }));
      // setViewProfile(false);
    } else {
      setLoginModal({ openForm: 'login' });
    }
  };

  const onCloseModel = () => {
    setAction((prev) => ({ ...prev, openModel: false }));
    // setViewProfile(false);
  };

  const onPurchaseSucess = () => {
    setAction((prev) => ({ ...prev, openModel: false, isBought: true }));
  };

  const onSubcribeSuccess = () => {
    setAction((prev) => ({ ...prev, openModel: false, isSubscribed: true }));
  };

  useEffect(() => {
    if (!viewed.current) {
      const onIncreaseView = async () => {
        await feedService.views(item._id);
        viewed.current = true;
      };
      onIncreaseView();
    }
    if (inView) {
      onView(idx);
    } else {
      setViewProfile(false);
      setOpenComment(false);
    }
  }, [inView]);

  return (
    <>
      <div className={style['reel-wrapper']} id={`reel_player_card_${item._id}`} ref={ref}>
        {viewable ? (
          <div className={style['player-container']}>
            <ReelPlayer
              key={item._id}
              videoSrc={video?.url || ''}
              thumbUrl={video?.thumbnails && video.thumbnails[0]}
              aspectRatio={video?.height && video.width ? video.width / video.height : 16 / 9}
              inView={inView}
              volume={volume}
            />
            <FooterLeft item={item} />
          </div>
        ) : (
          <div className={style['video-notAllow']}>
            <img
              loading="lazy"
              src={video.thumbnails ? video.thumbnails[0] : '/no-image.jpg'}
              alt=""
              className={style['video-notAllow-image']}
            />
            <div className={style['video-notAllow-content']}>
              <p>
                <AiOutlineLock />
              </p>
              {item.isSale && item.price > 0 && !action.isBought && (
                <Button
                  disabled={user.isPerformer}
                  className="primary"
                  type="primary"
                  onClick={onOpenModel}
                >
                  {intl.formatMessage({
                    id: 'unblockFor',
                    defaultMessage: 'Unblock For'
                  })}
                  &nbsp;
                  <Price amount={item.price} />
                </Button>
              )}
              {item.isSub && !action.isSubscribed && (
                <Button
                  disabled={user?.isPerformer}
                  className="primary"
                  type="primary"
                  onClick={onOpenModel}
                >
                  {intl.formatMessage({
                    id: 'subscribeToUnlock',
                    defaultMessage: 'Subscribe to unlock'
                  })}
                </Button>
              )}
            </div>
          </div>
        )}
        <RightMenuWrapper
          onClickProfile={() => { setViewProfile(!viewProfile); setOpenComment(false); }}
          onClickComment={() => { setOpenComment(!openComment); setViewProfile(false); }}
          openComment={openComment}
          item={item}
          volume={volume}
          setVolume={setVolume}
          performer={performer}
          currentIndex={idx}
          total={total}
        />
        {viewProfile && (
          <ModelBox
            reel={item}
            performer={item.performer}
            openComment={action.comment}
            onCloseComment={() => { }}
            onClickCloseProfile={() => { setViewProfile(!viewProfile); setOpenComment(false); }}
          />
        )}
        {openComment && (
          <CommentsReelWrapper
            item={item}
            onClose={() => { setOpenComment(!openComment); setViewProfile(false); }}
          />
        )}
      </div>
      {action.openModel && (
        <PurchaseReelsForm
          reels={item}
          open={action.openModel}
          onClose={onCloseModel}
          onPurchaseSucess={onPurchaseSucess}
          onSubcribeSuccess={onSubcribeSuccess}
        />
      )}
    </>
  );
}
