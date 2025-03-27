/* eslint-disable @typescript-eslint/no-unused-vars */
import Link from 'next/link';
import { useIntl } from 'react-intl';
import { IPerformer, IMedia } from '@interfaces/index';
import { isMobile } from 'react-device-detect';
import { useEffect, useState } from 'react';
import styles from './participants.module.scss';

interface IProps {
  item: IMedia;
}

function ParticipantMediaList({ item }: IProps) {
  const intl = useIntl();
  const [isMobileDevice, setIsMobileDevice] = useState(isMobile);
  const [isActive, setIsActive] = useState(false);

  const handelChangeCollapse = (e: string[]) => {
    setIsActive(e.length >= 2);
  };

  useEffect(() => {
    const handleResize = () => {
      // eslint-disable-next-line no-shadow
      const isMobile = window.innerWidth <= 768;
      setIsMobileDevice(isMobile);
      setIsActive(!isMobile);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={styles['participant-content']}>
      <header className={styles['participant-header']}>
        {intl.formatMessage({ id: 'participants', defaultMessage: 'participants' })}
      </header>
      <main className={styles['participant-list']}>
        {item?.participants?.map((p: IPerformer) => (
          <Link
            key={p?._id || p?.username}
            href={`/${p?.username || p?._id}`}
            className={styles['participant-item']}
          >
            <img
              src={p.avatar || '/no-avatar.jpg'}
              className={styles['participant-item-avt']}
              alt=""
            />
            <div className={styles['participant-item-info']}>
              <span className={styles.name}>{p.name || 'N/A'}</span>
              <span className={styles.username}>
                @
                {p.username || 'N/A'}
              </span>
            </div>
          </Link>
        ))}
      </main>
    </div>
  );
}

export default ParticipantMediaList;
