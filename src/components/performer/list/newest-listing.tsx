'use client';

import Link from 'next/link';
import { IPerformer } from '@interfaces/performer';
import { useIntl } from 'react-intl';
import styles from './newest-listing.module.scss';
import NewestCard from '../card/newest-card';

interface IProps {
  performers: IPerformer[]
}
export default function HomePerformers({ performers }: IProps) {
  const intl = useIntl();
  return (
    <div className={styles['newest-listing']}>
      <header className={styles['newest-listing-header']}>
        <div className={styles['header-text']}>
          <div className={styles['header-text-mark']} />
          <p className={styles['header-text-title']}>
            {intl.formatMessage({ id: 'newOnHelloYou', defaultMessage: 'New on Hello You' })}
          </p>
        </div>
        <Link href="/creator" className={styles['header-all']}>
          {intl.formatMessage({ id: 'viewAll', defaultMessage: 'View All' })}
        </Link>
      </header>
      <main className={styles['newest-listing-main']}>
        {performers.map((p) => <NewestCard key={p._id} performer={p} />)}
      </main>
    </div>
  );
}
