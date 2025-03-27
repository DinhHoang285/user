'use client';

import { AiOutlineGift } from 'react-icons/ai';
import PageHeading from '@components/common/page-heading';
import Link from 'next/link';
import { useIntl } from 'react-intl';
import styles from './collection.module.scss';

interface IProps {
  collection: any;
  performerId: any;
}

export default function CollectionContainer({ collection, performerId }: IProps) {
  const intl = useIntl();
  return (
    <div className="main-container">
      <div className={styles.headings}>
        <PageHeading
          title={intl.formatMessage({ id: 'myCollection', defaultMessage: 'My Collection' })}
          icon={<span><AiOutlineGift /></span>}
        />
        <span>
          <Link href={`/${performerId.toString()}`}>
            <span>{intl.formatMessage({ id: 'backToProfile', defaultMessage: 'Back to Profile' })}</span>
          </Link>
        </span>
      </div>
      <ul className={styles.container}>
        {collection.length ? collection.map((col) => (
          <li className={styles['item-collection']} key={col._id}>
            <div>
              <div className={styles.header}>
                <div className={styles['header-left']}>
                  <img src={col.iconUrl} alt="" />
                  <p>
                    <span>{col.groupName}</span>
                  </p>
                </div>
                <div className={styles['header-right']}>
                  <span>{intl.formatDate(col.updatedAt)}</span>
                </div>
              </div>
              <hr />
              <ul className={styles['list-gift']}>
                {col.gifts.length && col.gifts.map((g) => (
                  <li className={`${styles.gift} ${!g.giftCount ? styles['no-gift'] : ''}`} key={g.id}>
                    <div className={styles['box-img']}>
                      <img src={g.giftUrl} alt="" />
                    </div>
                    <span className={styles['box-quantity']}>
                      <span>{g.giftCount}</span>
                      <span> x</span>
                    </span>
                    <p className={styles['box-name']}>
                      <span>{g.giftName || ''}</span>
                    </p>
                    <p className={styles['box-description']}>
                      <span>{g.giftDescriptons || ''}</span>
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))
          : (
            <p style={{ textAlign: 'center' }}>
              <span>{intl.formatMessage({ id: 'noDataFound', defaultMessage: 'No data was found' })}</span>
            </p>
          )}
      </ul>
    </div>
  );
}
