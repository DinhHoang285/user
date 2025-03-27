'use client';

import { IFeed } from '@interfaces/feed';
import { IPerformer } from '@interfaces/performer';
import { formatTimeAgo, formatViews } from '@lib/media';
import Link from 'next/link';
import { useIntl } from 'react-intl';
import styles from './home-card.module.scss';

interface IProps {
  item: IFeed
}
export default function HomeCard({ item }: IProps) {
  const thumbUrl = item?.files.length && item?.files[0].thumbnails.length
    ? item?.files[0].thumbnails[0]
    : './no-image.jpg';
  const performer: IPerformer = item?.performer || item.admin;
  const intl = useIntl();
  const href = (item as any).isAd && (item as any).redirectLink
    ? (item as any).redirectLink
    : `/reels?performerId=${item?._id}&id=${item.slug || item._id}&isAd=${(item as any)?.isAd || false}`;

  return (
    <div className={styles['card-wrapper']}>
      <Link
        href={href}
        className={styles['card-thumb']}
      >
        <img src={thumbUrl} alt={item.title} />
        {(item as any).isAd
          && (
            <p className={styles['card-thumb-ad']}>
              {intl.formatMessage({ id: 'ad', defaultMessage: 'AD' })}
            </p>
          )}
      </Link>
      <div className={styles['card-footer']}>
        <img src={performer?.avatar || '/no-avatar.jpg'} className={styles['card-footer-avt']} alt="" />
        <div className={styles['card-footer-info']}>
          <Link
            href={`/reels?includedId=${item.slug || item._id}`}
            className={styles['card-info-title']}
          >
            {item.title}
          </Link>
          <p className={styles['card-info-owner']}>{performer?.username}</p>
          <div className={styles['card-info-stas']}>
            <p>
              {formatViews(item?.stats?.views)}
              {' '}
              {intl.formatMessage({ id: 'views', defaultMessage: 'views' })}
            </p>
            |
            <p>{formatTimeAgo(item.createdAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
