'use client';

import { IPerformer } from 'src/interfaces';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import ImageWithFallback from '@components/common/images/image-fallback';
import { VerifiedIcon } from 'src/icons';
import style from './style.module.scss';
import FollowButton from '../../buttons/follow-button';
import defaultCoverImg from '../../../../public/default-banner.jpeg';
import defaultAvatarImg from '../../../../public/no-avatar.jpg';

interface IProps {
  performer: IPerformer;
}

export default function PerformerLineCard({ performer }: IProps) {
  const { data } = useSession();
  return (
    <div className={style['model-card']}>
      <ImageWithFallback
        options={{
          width: 399,
          height: 173,
          quality: 70,
          fill: true,
          sizes: '(max-width: 768px) 80vw, (max-width: 2100px) 25vw',
          className: 'c-cover'
        }}
        fallbackSrc={defaultCoverImg}
        src={performer.cover || defaultCoverImg}
        alt="creator-cover"
      />
      <Link
        href={`/${performer.username}`}
        className="card-btt"
      >
        <div className="card-img">
          <ImageWithFallback
            options={{
              width: 60,
              height: 60,
              quality: 50,
              fill: true,
              sizes: '(max-width: 768px) 30vw, (max-width: 2100px) 10vw'
            }}
            fallbackSrc={defaultAvatarImg}
            alt="avatar"
            src={performer?.avatar || defaultAvatarImg}
          />
          {performer?.live > 0 && <span className="live-status">Live</span>}
        </div>
        <div className="model-name">
          <div className="name">
            {performer?.name || 'N/A'}
            {performer?.verifiedAccount && (
              <VerifiedIcon />
            )}
          </div>
          <p>{`@${performer?.username || 'n/a'}`}</p>
        </div>
      </Link>
      {!data?.user?.isPerformer && (
        <FollowButton performer={performer} />
      )}
    </div>
  );
}
