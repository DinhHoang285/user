import Link from 'next/link';
import { VerifiedIcon } from 'src/icons';
import ImageWithFallback from '@components/common/images/image-fallback';
import style from './performer-avatar.module.scss';
import defaultAvatar from '../../../../public/no-avatar.jpg';

export default function PerformerAvatar({
  performer
}: any) {
  return (
    <Link
      href={`/${performer.username}`}
    >
      <div className={style['creator-grp']}>
        <ImageWithFallback
          options={{
            width: 100,
            height: 100,
            style: { width: 65, height: 65, borderRadius: '50%' },
            className: style.avatar
          }}
          alt="avatar"
          fallbackSrc={defaultAvatar}
          src={performer?.avatar || defaultAvatar}
        />
        <div className={style['name-grp']}>
          <div className={style.name}>
            {performer.name || 'N/A'}
            {performer.verifiedAccount && <VerifiedIcon />}
          </div>
          <div className={style.username}>
            {`@${performer.username || 'n/a'}`}
          </div>
        </div>
      </div>
    </Link>
  );
}
