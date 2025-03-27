'use client';

import LikeButton from '@components/action-buttons/like-button';
import ImageWithFallback from '@components/common/images/image-fallback';
import TipPerformerButton from '@components/performer/tip/tip-btn';
import { IFeed } from '@interfaces/feed';
import { IPerformer } from '@interfaces/performer';
import {
  AiOutlineDown, AiOutlineUp
} from 'react-icons/ai';
import CommentReelButton from './comment-btn';
import MuteReelButton from './mute-btn';
import style from './style.module.scss';

interface IProps {
  item: IFeed;
  onClickProfile: Function;
  onClickComment: Function;
  openComment: boolean;
  volume: number;
  setVolume: Function;
  performer: IPerformer;
  currentIndex: number;
  total: number;
}

export default function RightMenuWrapper({
  item,
  onClickProfile = () => { },
  onClickComment = () => { },
  openComment = false,
  volume = 1,
  setVolume,
  performer,
  currentIndex,
  total
}: IProps) {
  return (
    <div className={style['footer-right']}>
      <div className={style['sidebar-nav']}>
        <button
          disabled={currentIndex === 0}
          type="button"
          onClick={() => {
            const ele = document.getElementById(`reel_player_card_${currentIndex - 1}`);
            ele && ele.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <AiOutlineUp />
        </button>
        <button
          type="button"
          disabled={currentIndex === total - 1}
          onClick={() => {
            const ele = document.getElementById(`reel_player_card_${currentIndex + 1}`);
            ele && ele.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <AiOutlineDown />
        </button>
      </div>
      <div className={style['sidebar-icon']}>
        {performer._id && (
          <button type="button" className={style.avatar} onClick={() => onClickProfile()}>
            <ImageWithFallback
              options={{
                width: 60,
                height: 60,
                unoptimized: true
              }}
              alt="avatar"
              src={performer?.avatar || '/no-avatar.jpg'}
              fallbackSrc="/no-avatar.jpg"
            />
          </button>
        )}
        <CommentReelButton item={item} isActive={openComment} onClick={onClickComment.bind(this)} />
        <MuteReelButton muted={!volume} onClick={() => setVolume({ volume: !volume ? 1 : 0 })} />
        <TipPerformerButton performer={performer} hideText />
        <LikeButton
          performerId={item.fromSourceId}
          objectType="reel"
          objectId={item._id}
          liked={item.isLiked}
          totalLike={item.totalLike}
          inContentView
        />
      </div>
    </div>
  );
}
