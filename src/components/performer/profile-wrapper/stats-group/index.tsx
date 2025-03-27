import {
  AiOutlineFire, AiOutlineVideoCamera, AiOutlinePicture, AiOutlineShopping, AiOutlineHeart, AiOutlineUsergroupAdd
} from 'react-icons/ai';
import { IPerformer } from '@interfaces/performer';
import { shortenLargeNumber } from '@lib/number';
import style from './style.module.scss';

type Props = {
  performer: IPerformer;
};

export default function StatsRow({
  performer
}: Props) {
  return (
    <div className={style['stats-row']}>
      <div className={style['tab-item']}>
        <span>
          {shortenLargeNumber(performer.stats?.totalFeeds || 0)}
          {' '}
          <AiOutlineFire />
        </span>
      </div>
      <div className={style['tab-item']}>
        <span>
          {shortenLargeNumber(performer.stats?.totalVideos || 0)}
          {' '}
          <AiOutlineVideoCamera />
        </span>
      </div>
      <div className={style['tab-item']}>
        <span>
          {shortenLargeNumber(performer.stats?.totalPhotos || 0)}
          {' '}
          <AiOutlinePicture />
        </span>
      </div>
      <div className={style['tab-item']}>
        <span>
          {shortenLargeNumber(performer.stats?.totalProducts || 0)}
          {' '}
          <AiOutlineShopping />
        </span>
      </div>
      <div className={style['tab-item']}>
        <span>
          {shortenLargeNumber(performer.stats?.likes || 0)}
          {' '}
          <AiOutlineHeart />
        </span>
      </div>
      <div className={style['tab-item']}>
        <span>
          {shortenLargeNumber(performer.stats?.subscribers || 0)}
          {' '}
          <AiOutlineUsergroupAdd />
        </span>
      </div>

    </div>
  );
}
