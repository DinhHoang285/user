/* eslint-disable no-nested-ternary */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable react/no-array-index-key */
import { IPerformer } from '@interfaces/performer';
import Link from 'next/link';
import { useIntl } from 'react-intl';
import styles from './collection.module.scss';

interface IProps {
  collection: any;
  performer: IPerformer;
  dataShowProfile: any;
}

function Collections({ collection, performer, dataShowProfile }: IProps) {
  const intl = useIntl();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>
          {intl.formatMessage({
            id: 'myCollection',
            defaultMessage: 'My Collection'
          })}
        </h2>
        <span className={styles['view-all']}>
          <Link href={`/collection/${performer._id}`}>
            {intl.formatMessage({
              id: 'viewAll',
              defaultMessage: 'View All'
            })}
          </Link>
        </span>
      </div>
      <hr />
      <div className={styles.content}>
        <ul className={styles['list-gift']}>
          {collection.length
            ? collection.map((c, idx) => {
              if (c.showItem) {
                return (
                  <li key={`gift_${idx}`} className={!c.giftCount ? styles['no-gift'] : ''}>
                    <div className={styles.giftGroup}>
                      <img className={`${styles.image}`} src={c.giftUrl} alt="" />

                      <span className={styles.totalGift}>
                        {c.giftCount}
                        {' '}
                        x
                      </span>
                    </div>
                  </li>
                );
              }
            })
            : dataShowProfile[0]?.items?.length
              ? dataShowProfile[0].items.map((g, idx) => {
                if (g.showItem) {
                  return (
                    <li key={`gift_${idx}`} className={styles['no-gift']}>
                      <div className={styles.giftGroup}>
                        <img className={`${styles.image}`} src={g.iconUrl} alt="" />

                        <span className={styles.totalGift}>
                          0
                          x
                        </span>
                      </div>
                    </li>
                  );
                }
              })
              : null}
        </ul>
      </div>
    </div>
  );
}

export default Collections;
