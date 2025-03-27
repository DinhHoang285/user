'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { showError } from '@lib/message';
import { reactionService } from '@services/reaction.service';
import { AiOutlineBook, AiFillBook } from 'react-icons/ai';
import { useMainThemeLayout } from 'src/providers/main-layout.provider';

interface IProps {
  objectId: string;
  objectType: string;
  // totalFavourite: number;
  isBookmarked: boolean;
}

export default function BookmarkContentButton({
  objectId, objectType, isBookmarked
}: IProps) {
  const { data } = useSession();
  const [bookmarked, setbookmarked] = useState(isBookmarked);
  const { setLoginModal } = useMainThemeLayout();

  return (
    <button
      type="button"
      className={bookmarked ? 'active' : ''}
      onClick={async () => {
        if (!data?.user?._id) {
          setLoginModal({ openForm: 'login' });
          return;
        }
        if (data?.user?.isPerformer) return;
        try {
          if (!bookmarked) {
            setbookmarked(true);
            await reactionService.create({
              objectId,
              action: 'bookmark',
              objectType
            });
          } else {
            setbookmarked(false);
            await reactionService.delete({
              objectId,
              action: 'bookmark',
              objectType
            });
            // if (window.location.pathname === '/bookmark') {
            //   window.location.href = `/follow${window.location.search}`;
            // }
          }
        } catch (e) {
          showError(e);
        }
      }}
    >
      <span>
        {bookmarked ? <AiFillBook /> : <AiOutlineBook />}
      </span>
    </button>
  );
}
