/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import { IPerformer } from '@interfaces/performer';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AiOutlinePlus, AiOutlineMessage } from 'react-icons/ai';
import { PiFilmReelLight } from 'react-icons/pi';
import { useMainThemeLayout } from 'src/providers/main-layout.provider';
import { useIntl } from 'react-intl';
import style from './user-actions-group.module.scss';

const FollowButton = dynamic(() => import('@components/performer/buttons/follow-button'));
const TipPerformerButton = dynamic(() => import('@components/performer/tip/tip-btn'));
const BookmarkButton = dynamic(() => import('@components/action-buttons/bookmark-button'));
const ShareButtons = dynamic(() => import('@components/performer/buttons/share-profile'));

type Props = {
  performer: IPerformer;
  user?: any;
  unShare?: boolean;
};

export default function UserActionsGroup({ performer, user, unShare }: Props) {
  const router = useRouter();
  const { setLoginModal } = useMainThemeLayout();
  const intl = useIntl();

  return (
    <div className={style['actions-grp']}>
      {user?._id === performer?._id ? (
        <Link
          href="/my-post/create"
          className={style.btn}
        >
          <span style={{ display: 'flex', alignItems: 'center' }}>
            <AiOutlinePlus />
          </span>
        </Link>
      ) : (
        <div className={`${style.btn}
        disabled-btn`}
        >
          <span style={{ display: 'flex', alignItems: 'center' }}>
            <AiOutlinePlus />
          </span>
        </div>
      )}
      <Link href={`/reels/?performerId=${performer._id}&id=short-free&isAd=false`} className={style.btn}><PiFilmReelLight /></Link>
      <FollowButton performer={performer} classes={`${style['btn-action']} ${style['btn-border']}`} />
      <TipPerformerButton
        classes={`${style['btn-action']} ${style['btn-border']}`}
        performer={performer}
        hideText
      />
      <button
        type="button"
        disabled={user?.isPerformer}
        className={`${style.btn} ${user?.isPerformer ? 'disabled-btn' : ''}`}
        onClick={() => {
          if (!user?._id) {
            setLoginModal({ openForm: 'login' });
          } else {
            router.push(`/messages?toSource=performer&toId=${performer._id || ''}`);
          }
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <AiOutlineMessage />
        </span>
        <span className="none">
          {intl.formatMessage({ id: 'message', defaultMessage: 'Message' })}
        </span>
      </button>
      <BookmarkButton
        objectId={performer?._id}
        objectType="performer"
        bookmarked={!!performer?.isBookMarked}
        inContentView
      />
      {!unShare && <ShareButtons performer={performer} />}
    </div>
  );
}

UserActionsGroup.defaultProps = {
  unShare: false
};
