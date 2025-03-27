'use client';

import { IFeed } from '@interfaces/feed';
import { useSession } from 'next-auth/react';
import { useMainThemeLayout } from 'src/providers/main-layout.provider';

import { useState } from 'react';
import LockMiddle from './lock-content-middle';
import PostMediaViewer from './media-viewer';

interface IProps {
  feed: IFeed;
  priority: boolean;
}

export default function PostCardMiddle({ feed, priority }: IProps) {
  const { data: session } = useSession();
  const { followedIds } = useMainThemeLayout();
  const isFollowed = followedIds.includes(feed.performer._id);
  const [isBought, setIsBought] = useState(feed.isBought);

  let canView = feed.isFree
    || (feed.isSub && feed.isSubscribed)
    || (feed.isSale && isBought)
    || (feed.isSale && !feed.price && isFollowed)
    || feed.type === 'text'
    || feed.fromSourceId === session?.user?._id;

  if (!session?.user?._id || (session?.user?._id !== feed.fromSourceId && session?.user?.isPerformer)) {
    canView = false;
  }
  if (feed.type === 'text') return null;

  const onPaymentSuccess = (data) => {
    if (!data || data.targetId !== feed._id || isBought) return;
    setIsBought(true);
  };
  return canView && feed?.files?.length ? (
    <PostMediaViewer
      feed={feed}
      priority={priority}
    />
  ) : (
    <LockMiddle
      feed={feed}
      onPaymentSuccess={onPaymentSuccess}
    />
  );
}
