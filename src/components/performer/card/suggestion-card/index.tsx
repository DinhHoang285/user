'use client';

import moment from 'moment';
import Link from 'next/link';
import { AiOutlineCheck, AiFillStar } from 'react-icons/ai';
import { IPerformer } from 'src/interfaces';
import classNames from 'classnames';
import ImageWithFallback from '@components/common/images/image-fallback';
import style from './style.module.scss';

interface IProps {
  performer: IPerformer;
}

export default function SuggestionPerformerCard({ performer }: IProps) {
  return (
    <div className={style['model-card']}>
      <Link href={`/${performer?.username || performer?._id}`}>
        <ImageWithFallback
          options={{
            width: 500,
            height: 200,
            className: style['cover-img'],
            sizes: '(max-width: 767px) 50vw, (min-width: 768px) 20vw'
          }}
          src={performer?.cover || '/default-banner.jpeg'}
          fallbackSrc="/default-banner.jpeg"
          alt="cover"
        />
        <div className={style['card-avatar']}>
          <div className={style['avatar-img']}>
            <ImageWithFallback
              options={{
                width: 100,
                height: 100,
                sizes: '(max-width: 767px) 30vw, (min-width: 768px) 10vw'
              }}
              src={performer?.avatar || '/no-avatar.jpg'}
              fallbackSrc="/no-avatar.jpg"
              alt="avatar"
            />
            <span className={classNames(style['online-status'], {
              [style.active]: performer?.isOnline > 0
            })}
            />
          </div>
        </div>
        <div className={style['card-bottom']}>
          <div className={style['name-grp']}>
            <div className={style.name}>
              {performer?.name || 'N/A'}
              &nbsp;
              {performer?.verifiedAccount && <AiOutlineCheck />}
              &nbsp;
              {performer?.isFeatured && <AiFillStar />}
            </div>
            <div className={style.username}>
              {`@${performer?.username || 'n/a'}`}
            </div>
          </div>
          <span className={style.age}>
            {performer.dateOfBirth && moment().diff(moment(performer.dateOfBirth), 'years') > 0 && `${moment().diff(moment(performer.dateOfBirth), 'years')}+`}
          </span>
        </div>
      </Link>
    </div>
  );
}
