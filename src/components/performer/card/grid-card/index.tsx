/* eslint-disable @typescript-eslint/no-unused-vars */
import { AiFillStar, AiOutlineCheck } from 'react-icons/ai';
import ImageWithFallback from '@components/common/images/image-fallback';
import classNames from 'classnames';
import Link from 'next/link';
import { IPerformer, IUser } from 'src/interfaces';
import { useSession } from 'next-auth/react';
import FollowButton from '../../buttons/follow-button';
import style from './style.module.scss';

interface IProps {
  performer: IPerformer;
}

function PerformerGridCard({ performer }: IProps) {
  const { data: session, update: updateUser } = useSession();
  const user: IUser = session?.user as IUser;

  return (
    <div className={classNames(style['grid-card'])}>
      <div
        className={classNames(style['grid-card-img'], {
          [style.live]: performer?.live > 0
        })}
      >
        <Link
          href={`/${performer?.username || performer?._id}`}
        >
          <ImageWithFallback
            options={{
              width: 260,
              height: 360,
              quality: 50,
              sizes: '20vw',
              className: style.avatar
            }}
            alt="avatar"
            src={performer?.avatar || '/no-avatar.jpg'}
            fallbackSrc="/no-avatar.jpg"
          />
        </Link>
        <span
          className={classNames(style['online-status'], {
            [style.active]: performer?.isOnline > 0
          })}
        />
        {performer?.live > 0 && (
          <span className={style['live-status']}>
            <i />
            {' '}
            <span>
              Live
            </span>
          </span>
        )}
      </div>
      <div className={style['grid-card-txt']}>
        <div className={classNames(style['model-name'])}>
          <h3>{performer?.name || performer?.username || 'N/A'}</h3>
          {performer?.verifiedAccount && <AiOutlineCheck />}
          {performer?.isFeatured && <AiFillStar />}
          <span
            className={classNames(style['online-status-mb'], {
              [style.active]: performer?.isOnline > 0
            })}
          />
        </div>
      </div>
      <div>
        {!user?.isPerformer && (
          <FollowButton performer={performer} classes={style['follow-btn']} />
        )}
      </div>
    </div>
  );
}

export default PerformerGridCard;
