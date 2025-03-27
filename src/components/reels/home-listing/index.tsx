import { IFeed } from '@interfaces/feed';
import HomeCard from './home-card';
import styles from './style.module.scss';

interface IProps {
  reels: IFeed[]
}

export default function ReelsHomeListing({ reels }: IProps) {
  return (
    <div className={styles['listing-wrapper']}>
      <header className={styles['listing-header']}>
        <div className={styles['listing-header-mark']} />
        <p className={styles['listing-header-title']}>Shorts</p>
      </header>
      <main className={styles['listing-main']}>
        {
          reels && reels?.length > 0
            ? reels?.map((item) => <HomeCard key={item._id} item={item} />)
            : null
        }
      </main>
    </div>
  );
}
