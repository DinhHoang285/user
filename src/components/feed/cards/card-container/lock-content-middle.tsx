'use client';

import { AiOutlineLock, AiOutlineUnlock } from 'react-icons/ai';
import Price from '@components/common/price';
import { IFeed } from '@interfaces/feed';
import { getThumbnail } from '@lib/utils';
import { Button } from 'antd';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { IPerformer } from '@interfaces/performer';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useMainThemeLayout } from 'src/providers/main-layout.provider';
import style from './lock-content-middle.module.scss';

const ViewTeaserBtn = dynamic(() => import('./view-teaser-btn'), {
  ssr: false
});
const PurchaseFeedForm = dynamic(() => import('@components/feed/cards/line-card/card-middle/lock-content-middle/purchase-btn/confirm-modal'), {
  ssr: false
});

type Props = {
  feed: IFeed;
  onPaymentSuccess?: Function;
};

export default function LockContentMiddle({ feed, onPaymentSuccess = () => { } }: Props) {
  const intl = useIntl();
  const [isHovered, setHover] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { data: session } = useSession();
  const user: IPerformer = session?.user as IPerformer;
  const router = useRouter();
  const thumbUrl = getThumbnail(feed);
  const { setLoginModal } = useMainThemeLayout();

  return (
    <div className={style['lock-content']}>
      <div
        className={style['feed-bg']}
        style={{
          backgroundImage: `url(${thumbUrl})`,
          filter: thumbUrl === '/leaf.jpg' ? 'blur(2px)' : 'blur(20px)'
        }}
      />
      <div className={style['lock-middle']}>
        <span>
          {isHovered ? <AiOutlineUnlock /> : <AiOutlineLock />}
        </span>
        {!feed?.isSale && !feed?.isSubscribed && (
          <Button
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            disabled={user?.isPerformer}
            className="secondary"
            type="primary"
            onClick={() => {
              if (!user?._id) {
                setLoginModal({ openForm: 'login' });
              } else {
                setShowModal(true);
              }
            }}
          >
            {intl.formatMessage({
              id: 'subscribeToUnlock',
              defaultMessage: 'Subscribe to unlock'
            })}
          </Button>
        )}
        {feed?.isSale && feed?.price > 0 && !feed?.isBought && (
          <Button
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            disabled={user?.isPerformer}
            className="secondary"
            type="primary"
            onClick={() => {
              if (!user?._id) {
                setLoginModal({ openForm: 'login' });
              } else {
                setShowModal(true);
              }
            }}
          >
            {intl.formatMessage({
              id: 'unblockFor',
              defaultMessage: 'Unblock For'
            })}
            &nbsp;
            <Price amount={feed?.price} />
          </Button>
        )}
        {feed?.isSale && !feed?.price && !user?._id && (
          <Button
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            disabled={user?.isPerformer}
            className="secondary"
            type="primary"
            onClick={() => {
              router.push(`/${feed?.performer?.username || feed?.performer?._id}`);
            }}
          >
            {intl.formatMessage({
              id: 'followForFree',
              defaultMessage: 'Follow for free'
            })}
          </Button>
        )}
        {!!feed?.teaser && <ViewTeaserBtn teaser={feed?.teaser} />}
      </div>
      {showModal && (
        <PurchaseFeedForm
          feed={feed}
          onClose={() => setShowModal(false)}
          onPaymentSuccess={onPaymentSuccess}
        />
      )}
    </div>
  );
}
