'use client';

import { showError, showSuccess } from '@lib/message';
import { reactionService } from '@services/reaction.service';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { AiFillBook, AiOutlineBook } from 'react-icons/ai';
import { useIntl } from 'react-intl';
import { useMainThemeLayout } from 'src/providers/main-layout.provider';
import style from './style.module.scss';

type Props = {
  bookmarked: boolean;
  objectType: string;
  objectId: string;
  totalBookmark?: number;
  inContentView?: boolean;
};

export default function BookmarkButton({
  objectType,
  objectId,
  bookmarked,
  totalBookmark = 0,
  inContentView = false

}: Props) {
  const intl = useIntl();
  const [isBookmarked, setBookmarked] = useState(bookmarked);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(totalBookmark);
  const { data: session } = useSession();
  const user = session?.user;
  const { setLoginModal, setAutoPlayVideo } = useMainThemeLayout();

  return (
    <button
      type="button"
      className={`
        ${style['action-ico']}
        ${style['action-btn']}
        ${isBookmarked ? style.active : null}
        ${inContentView ? style.inContentView : null}
        ${loading || user?.isPerformer ? 'disabled-btn' : null}
        `}
      onClick={async () => {
        setAutoPlayVideo({ autoPlayBtn: 'off' });
        if (!user?._id) {
          setLoginModal({ openForm: 'login' });
          return;
        }
        try {
          setLoading(true);
          if (!isBookmarked) {
            await reactionService.create({ objectId, objectType, action: 'bookmark' });
            setBookmarked(true);
            setTotal(total + 1);
          } else {
            await reactionService.delete({
              objectId,
              objectType,
              action: 'bookmark'
            });
            setBookmarked(false);
            setTotal(total - 1);
          }
          showSuccess(!isBookmarked ? intl.formatMessage({ id: 'addedToBookmarks', defaultMessage: 'Added to Bookmarks' }) : intl.formatMessage({ id: 'removedFromBookmarks', defaultMessage: 'Removed from Bookmarks' }));
        } catch (e) {
          showError(e);
        } finally {
          setLoading(false);
        }
      }}
      disabled={loading || user?.isPerformer}
    >
      {isBookmarked ? (
        <span className={style.icon}>
          <AiFillBook style={{
            color: '#09B3F2',
            display: 'flex',
            alignItems: 'center'
          }}
          />
        </span>
      ) : (
        <span className={style.icon}>
          <AiOutlineBook style={{
            color: '#09B3F2',
            display: 'flex',
            alignItems: 'center'
          }}
          />
        </span>
      )}
      <span className="none">{intl.formatMessage({ id: 'bookmarks', defaultMessage: 'Bookmarks' })}</span>
    </button>
  );
}
