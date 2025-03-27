'use client';

import TipPerformerButton from '@components/performer/tip/tip-btn';
import { IPerformer } from '@interfaces/performer';
import { IUser } from '@interfaces/user';
import { useSession } from 'next-auth/react';
import BookmarkButton from './bookmark-button';
import CommentButton from './comment-button';
import LikeButton from './like-button';
import style from './reaction-buttons.module.scss';

type Props = {
  isLiked?: boolean;
  totalLike?: number;
  isBookmarked?: boolean;
  totalBookmark?: number;
  totalComment?: number;
  onCommentClick?: Function;
  activeComment?: boolean;
  objectType: string;
  objectId: string;
  performer: IPerformer,
  unShowComment?: boolean,
  setDefaultTotalLike?: Function
};

function ReactionButtons({
  objectType,
  objectId,
  isLiked = false,
  totalLike = 0,
  totalBookmark = 0,
  totalComment = 0,
  onCommentClick = () => { },
  activeComment = false,
  isBookmarked = false,
  performer,
  unShowComment = false,
  setDefaultTotalLike
}: Props) {
  const { data: session } = useSession();
  const user: IUser = session?.user as any;
  return (
    <div className={style['act-btns']}>
      <LikeButton
        objectType={objectType}
        objectId={objectId}
        liked={isLiked}
        totalLike={totalLike}
        inContentView
        setDefaultTotalLike={setDefaultTotalLike}
      />
      {!user?.isPerformer && (
        <TipPerformerButton performer={performer} hideText inContentView />
      )}
      {!unShowComment
        && <CommentButton onClick={onCommentClick} active={activeComment} totalComment={totalComment} inContentView />}
      <BookmarkButton
        objectType={objectType}
        objectId={objectId}
        bookmarked={isBookmarked}
        totalBookmark={totalBookmark}
        inContentView
      />
    </div>
  );
}

ReactionButtons.defaultProps = {
  isLiked: false,
  totalLike: 0,
  isBookmarked: false,
  totalBookmark: false,
  totalComment: 0,
  onCommentClick: () => { },
  activeComment: false,
  unShowComment: false,
  setDefaultTotalLike: () => { }
};
export default ReactionButtons;
