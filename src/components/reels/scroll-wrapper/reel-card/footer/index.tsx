'use client';

import { useIntl } from 'react-intl';
import { IFeed } from '@interfaces/feed';
import style from './style.module.scss';

interface IProps {
  item: IFeed;
}

export default function FooterLeft({ item }: IProps) {
  const intl = useIntl();

  return (
    <div className={style['footer-container']}>
      {item.isAd && (
        <p>
          {intl.formatMessage({
            id: 'advertisement',
            defaultMessage: 'Advertisement'
          })}
        </p>
      )}
      <div className={style['footer-header']}>
        <p className={style['footer-header-username']}>
          @
          {item.performer.username}
        </p>
        <p className={style['footer-header-like']}>
          {item?.totalLike}
          {' '}
          {intl.formatMessage({
            id: 'likes',
            defaultMessage: 'likes'
          })}
        </p>
      </div>
      <p className={style['footer-main-text']}>
        {item.text}
        {' '}
        {item.tags.map((tag) => `#${tag}`).join(' ')}
      </p>
    </div>
  );
}
