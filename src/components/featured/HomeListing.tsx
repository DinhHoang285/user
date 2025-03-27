'use client';

import React from 'react';
import CardTreding from '@components/trending/card-trending';
import { useIntl } from 'react-intl';
import styles from './styles.module.scss';

interface IProps {
  feeds: any[],
  headless: boolean
}
export default function FeaturedHomeListing({ feeds, headless }: IProps) {
  const intl = useIntl();
  return (
    <div className={styles['featured-wrapper']}>
      {
        !headless
        && (
          <header className={styles['featured-header']}>
            <div className={styles['featured-header-mark']} />
            <p className={styles['featured-header-title']}>
              {intl.formatMessage({ id: 'featured', defaultMessage: 'Featured' })}
            </p>
          </header>
        )
      }
      <main className={styles['featured-main']}>
        {feeds.map((item) => <CardTreding key={item._id} item={item} />)}
      </main>
    </div>
  );
}
