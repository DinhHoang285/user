'use client';

import { useState } from 'react';
import { shortenLargeNumber } from '@lib/number';
import { reactionService } from '@services/reaction.service';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { showError } from '@lib/message';
import { useIntl } from 'react-intl';

interface P {
  objectId: string;
  objectType: string;
  totalLike: number;
  isLiked: boolean;
}

export default function LikeContentButton({
  objectId, objectType, isLiked, totalLike
}: P) {
  const intl = useIntl();
  const [total, setTotal] = useState(totalLike);
  const [liked, setLiked] = useState(isLiked);

  return (
    <button
      type="button"
      className={liked ? 'likepost active' : 'likepost'}
      onClick={async () => {
        try {
          if (!liked) {
            setLiked(true);
            setTotal((s) => s + 1);
            await reactionService.create({
              objectId,
              action: 'like',
              objectType
            });
          } else {
            setLiked(false);
            setTotal((s) => s - 1);
            await reactionService.delete({
              objectId,
              action: 'like',
              objectType
            });
          }
        } catch (e) {
          showError(
            intl.formatMessage({
              id: 'errorOccuredTryAgain',
              defaultMessage: 'An error occurred while processing your reaction.'
            })
          );
        }
      }}
    >
      <span className="">
        {liked ? <AiFillHeart /> : <AiOutlineHeart />}
      </span>
      <span className="count">
        {shortenLargeNumber(total)}
      </span>
    </button>
  );
}
