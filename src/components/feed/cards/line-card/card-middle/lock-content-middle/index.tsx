'use client';

import { IFeed } from '@interfaces/feed';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import {
  RiLockLine,
  RiLockUnlockLine
} from 'react-icons/ri';

const ViewTeaserBtn = dynamic(() => import('./view-teaser-btn'));
const SubscribePostBtn = dynamic(() => import('./subscribe-btn'));
const PurchasePostBtn = dynamic(() => import('./purchase-btn'));
const FollowPostBtn = dynamic(() => import('./follow-btn'));

type P = {
  feed: IFeed;
  onPaymentSuccess?: Function;
};

export default function LockMiddle({ feed, onPaymentSuccess }: P) {
  const [isHovered, setHovered] = useState(false);
  const thumbUrl = feed?.files?.[0]?.thumbnails?.[0] || '/leaf.jpg';
  return (
    <div className="lock-content">
      <div
        className="feed-bg"
        style={{
          backgroundImage: `url(${thumbUrl})`,
          filter: thumbUrl === '/leaf.jpg' ? 'blur(2px)' : 'blur(20px)'
        }}
      />
      <div className="lock-middle">
        {isHovered ? <RiLockUnlockLine /> : <RiLockLine />}
        {!feed.isSale && !feed.isSubscribed && (
          <SubscribePostBtn
            feed={feed}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          />
        )}
        {feed.isSale && feed.price > 0 && (
          <PurchasePostBtn
            feed={feed}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onPaymentSuccess={onPaymentSuccess}
          />
        )}
        {feed.isSale && !feed.price && !feed.isFollowed && (
          <FollowPostBtn
            feed={feed}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          />
        )}
        {feed.teaser && <ViewTeaserBtn teaser={feed.teaser} />}
      </div>
    </div>
  );
}
