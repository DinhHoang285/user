'use client';

import { RiThumbUpLine, RiThumbUpFill } from 'react-icons/ri';
import { shortenLargeNumber } from '@lib/number';
import { reactionService } from '@services/reaction.service';
import { useState } from 'react';
import { IUser } from '@interfaces/user';

type Props = {
  liked: boolean;
  totalLike: number;
  objectType: string;
  objectId: string;
  user: IUser;
};

export default function LikeReelButton({
  objectType,
  objectId,
  liked,
  totalLike,
  user
}: Props) {
  const [isLiked, setLiked] = useState(liked);

  return (
    <button
      type="button"
      className={isLiked ? 'active' : ''}
      onClick={async () => {
        if (!user?._id || user.isPerformer) {
          return;
        }
        if (!isLiked) {
          await reactionService.create({ objectId, objectType, action: 'like' });
          setLiked(true);
          // not update stats because listen from socket
        } else {
          await reactionService.delete({
            objectId,
            objectType,
            action: 'like'
          });
          setLiked(false);
        }
      }}
    >
      <span className="icon">
        {isLiked ? <RiThumbUpFill /> : <RiThumbUpLine />}
      </span>
      {totalLike > 0 && `${shortenLargeNumber(totalLike)} `}
    </button>
  );
}
