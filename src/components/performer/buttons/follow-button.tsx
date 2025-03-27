'use client';

import { IPerformer } from '@interfaces/performer';
import { IUser } from '@interfaces/user';
import { showError } from '@lib/message';
import { followService } from '@services/follow.service';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { useIntl } from 'react-intl';
import { useMainThemeLayout } from 'src/providers/main-layout.provider';
import style from './follow-button.module.scss';

interface P {
  performer: IPerformer;
  onFollow?: Function;
  classes?: string;
}

export default function FollowButton({ performer, onFollow = () => { }, classes = '' }: P) {
  if (!performer) return null;
  const [isFollowed, setIsFollowed] = useState(performer.isFollowed);
  const { data: session } = useSession();
  const user: IUser = session?.user as IUser;
  const { setLoginModal } = useMainThemeLayout();

  const intl = useIntl();

  const handleFollow = async () => {
    if (!user?._id) {
      showError(
        intl.formatMessage({
          id: 'pleaseLogInOrRegister',
          defaultMessage: 'Please log in or register!'
        })
      );
      setLoginModal({ openForm: 'login' });
      return;
    }
    if (user?.isPerformer) return;
    try {
      if (!isFollowed) {
        await followService.create(performer._id);
        setIsFollowed(true);
      } else {
        await followService.delete(performer._id);
        setIsFollowed(false);
      }
      onFollow && onFollow(!isFollowed);
    } catch (e) {
      showError(e);
    }
  };

  return (
    <button
      type="button"
      disabled={!!user?.isPerformer}
      onClick={handleFollow}
      className={
        `${style['follow-btn']}
        ${isFollowed ? style.active : ''}
        ${user?.isPerformer ? 'disabled-btn' : ''}
        ${classes}`
      }
    >
      {isFollowed ? (
        <AiFillHeart />
      ) : (
        <AiOutlineHeart />
      )}
      <span className="none">
        {isFollowed
          ? intl.formatMessage({ id: 'following', defaultMessage: 'Following' })
          : intl.formatMessage({ id: 'follow', defaultMessage: 'Follow' })}
      </span>
    </button>
  );
}
