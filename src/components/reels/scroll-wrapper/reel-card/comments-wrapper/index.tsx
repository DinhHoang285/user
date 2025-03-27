'use client';

import CommentWrapper from '@components/comment/comment-wrapper';
import { IFeed } from '@interfaces/feed';
import style from './style.module.scss';

interface IProps {
  item: IFeed;
  onClose: Function;
}

export default function CommentsReelWrapper({
  item, onClose
}: IProps) {
  return (
    <div className={style['cmt-reels-drawer']}>
      <CommentWrapper
        objectId={item._id}
        objectType="reel"
        onClickClose={() => onClose()}
        showClose
        showHead
      />
    </div>
  );
}
