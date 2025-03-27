/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/alt-text */
import { IFeed } from '@interfaces/feed';
import Item from './Item';
import styles from './Listing.module.scss';

interface IProps {
  reels: IFeed[];
}
function ReelListing({ reels }: IProps) {
  return (
    <div className={styles['listing-wrapper']}>
      {
        reels.map((item, idx) => (
          <Item key={idx} item={item} />
        ))
      }
    </div>
  );
}

export default ReelListing;
