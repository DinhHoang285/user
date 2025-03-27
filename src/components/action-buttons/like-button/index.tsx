'use client';

import { IUser } from '@interfaces/user';
import { showError, showSuccess } from '@lib/message';
import { shortenLargeNumber } from '@lib/number';
import { reactionService } from '@services/reaction.service';
import classNames from 'classnames';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import {
  AiFillHeart, AiFillLike, AiOutlineHeart, AiOutlineLike
} from 'react-icons/ai';
import { useMainThemeLayout } from 'src/providers/main-layout.provider';
import { useIntl } from 'react-intl';
import style from './style.module.scss';

type Props = {
  liked?: boolean;
  totalLike?: number;
  performerId?: string;
  objectType: string;
  objectId: string;
  displayType?: string;
  inContentView?: boolean;
  setDefaultTotalLike?: Function;
};

function LikeButton({
  performerId,
  objectType,
  objectId,
  liked,
  totalLike,
  displayType,
  inContentView,
  setDefaultTotalLike
}: Props) {
  const intl = useIntl();
  const [isLiked, setLiked] = useState(liked);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(totalLike);
  const { data: session } = useSession();
  const user: IUser = session?.user as IUser;
  const { setLoginModal, setAutoPlayVideo } = useMainThemeLayout();

  const onReaction = async () => {
    setAutoPlayVideo({ autoPlayBtn: 'off' });
    if (!user?._id) {
      setLoginModal({ openForm: 'login' });
      return;
    }
    try {
      if (performerId === user._id && objectType === 'comment') {
        showError(intl.formatMessage({
          id: 'cantLikeYourOwnComment',
          defaultMessage: 'You can\'t like your own comment!'
        }));
        return;
      }
      setLoading(true);
      if (!isLiked) {
        await reactionService.create({ objectId, objectType, action: 'like' });
        setLiked(true);
        setTotal(total + 1);
        if (setDefaultTotalLike) setDefaultTotalLike((prev) => prev + 1);
      } else {
        await reactionService.delete({
          objectId,
          objectType,
          action: 'like'
        });
        setLiked(false);
        setTotal(total - 1);
        if (setDefaultTotalLike) setDefaultTotalLike((prev) => prev - 1);
      }
      showSuccess(
        !isLiked
          ? intl.formatMessage({ id: 'liked', defaultMessage: 'Liked' })
          : intl.formatMessage({ id: 'unliked', defaultMessage: 'Unliked' })
      );
    } catch (e) {
      showError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTotal(totalLike);
  }, [totalLike]);

  return (
    <button
      type="button"
      className={classNames(
        style['ant-btn'],
        style['action-btn'],
        {
          [style.active]: isLiked,
          [style.inContentView]: inContentView,
          [style['btn-like-reel']]: objectType === 'reel'
        }
      )}
      onClick={onReaction}
      disabled={loading}
    >
      {!inContentView ? (
        <div>
          {total > 0 && <span>{shortenLargeNumber(total)}</span>}
          &nbsp;
          {['feed'].includes(displayType) ? (
            <div>
              <AiFillHeart style={{ color: isLiked ? '#E776E3' : '#fff', display: 'flex', alignItems: 'center' }} />
            </div>
          ) : (
            <div>
              {isLiked ? (
                <AiFillLike style={{ display: 'flex', alignItems: 'center' }} />
              ) : (
                <AiOutlineLike style={{ display: 'flex', alignItems: 'center' }} />
              )}
            </div>
          )}
        </div>
      ) : (
        <div>
          {isLiked ? (
            <AiFillHeart style={
              objectType === 'reel'
                ? { color: '#d36cd3', display: 'flex', alignItems: 'center' }
                : { color: '#09B3F2', display: 'flex', alignItems: 'center' }
            }
            />
          ) : (
            <AiOutlineHeart style={
              objectType === 'reel'
                ? { color: '#fff', display: 'flex', alignItems: 'center' }
                : { color: '#09B3F2', display: 'flex', alignItems: 'center' }
            }
            />
          )}
        </div>
      )}
    </button>
  );
}

LikeButton.defaultProps = {
  liked: false,
  totalLike: 0,
  performerId: '',
  displayType: 'default',
  inContentView: false,
  setDefaultTotalLike: () => { }
};

export default LikeButton;
