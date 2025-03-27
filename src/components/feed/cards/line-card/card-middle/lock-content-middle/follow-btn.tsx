'use client';

import { IFeed } from '@interfaces/feed';
import { showError } from '@lib/message';
import { followService } from '@services/follow.service';
import { useSession } from 'next-auth/react';
import { ReactNode, useEffect, useRef } from 'react';
import { useMainThemeLayout } from 'src/providers/main-layout.provider';

type IProps = {
  onMouseEnter: Function;
  onMouseLeave: Function;
  feed: IFeed;
  btnText?: ReactNode;
}

export default function FollowPostBtn({
  onMouseEnter, onMouseLeave, feed, btnText = 'Follow for free'
}: IProps) {
  const {
    setLoginModal, updateFollowIds, followedIds
  } = useMainThemeLayout();
  const { data: session } = useSession();
  const isFollowed = followedIds.includes(feed.fromSourceId);
  const isRemoved = useRef(false);

  useEffect(() => {
    if (feed.isFollowed && !followedIds.includes(feed.fromSourceId) && !isRemoved.current) {
      updateFollowIds({
        id: feed.performer._id,
        type: 'add'
      });
    }
  }, [feed]);

  return (
    <div className="follow-grp">
      <button
        onMouseEnter={onMouseEnter.bind(this)}
        onMouseLeave={onMouseLeave.bind(this)}
        type="button"
        className="secondary"
        onClick={async () => {
          if (!session?.user?._id) {
            setLoginModal({ openForm: 'login' });
            return;
          }
          if (session?.user.isPerformer) return;
          try {
            if (!isFollowed) {
              await followService.create(feed.fromSourceId);
              isRemoved.current = false;
              updateFollowIds({
                id: feed.fromSourceId,
                type: 'add'
              });
            } else {
              await followService.delete(feed.fromSourceId);
              isRemoved.current = true;
              updateFollowIds({
                id: feed.fromSourceId,
                type: 'remove'
              });
            }
          } catch (e) {
            showError(e);
          }
        }}
      >
        {btnText}
      </button>
    </div>
  );
}
