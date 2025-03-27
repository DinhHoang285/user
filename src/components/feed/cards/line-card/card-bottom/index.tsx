'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { IFeed } from '@interfaces/feed';
import { AiOutlineMessage, AiFillMessage } from 'react-icons/ai';
import { shortenLargeNumber } from '@lib/number';
import ReportButton from '@components/report/report-button';
import LikeContentButton from '@components/action-buttons/like-button/like-content-button';
import TipPerformerButton from '@components/performer/tip/tip-btn';
import BookmarkContentButton from '@components/action-buttons/bookmark-button/bookmark-content-button';

const CommentWrapper = dynamic(() => import('@components/comment/comment-wrapper'));

interface IProps {
  feed: IFeed;
}

export default function PostCardBottom({ feed }: IProps) {
  const [openComment, setOpenComment] = useState(false);

  return (
    <>
      <div className="feed-bottom">
        <div className="button-grp">
          <LikeContentButton
            objectId={feed._id}
            objectType="feed"
            totalLike={feed.totalLike || 0}
            isLiked={!!feed.isLiked}
          />
          <button
            type="button"
            className={openComment ? 'active' : ''}
            onClick={() => {
              setOpenComment(!openComment);
            }}
          >
            <span>
              {openComment ? <AiFillMessage /> : <AiOutlineMessage />}
              {shortenLargeNumber(feed.totalComment)}
            </span>
          </button>
          <TipPerformerButton
            performer={feed.performer}
          />
        </div>
        <div className="button-grp end">
          <ReportButton
            feed={feed}
          />
          <BookmarkContentButton
            objectId={feed._id}
            objectType="feed"
            isBookmarked={feed.isBookMarked}
          />
        </div>
      </div>
      {openComment && (
        <CommentWrapper
          objectId={feed._id}
          objectType="feed"
        // getTotal={setTotalComment}
        />
      )}
    </>
  );
}
