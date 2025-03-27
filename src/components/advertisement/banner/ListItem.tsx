import { IAdvertisement } from '@interfaces/advertisement';
import styles from './ListAdBanner.module.scss';

interface IProps {
  item: IAdvertisement
}
function ListItem({ item }: IProps) {
  const thumb = item?.thumbnail?.url || './no-image.jpg';
  return (
    <a
      href={item?.redirectLink ? item?.redirectLink : `/video/${item.slug || item._id}?isAd=true`}
      className={styles['item-wrapper']}
    >
      <img className={styles['item-thumb']} src={thumb} alt={item.title} />
      <p className={styles['item-tag']}>AD</p>
      <div className={styles['item-name']}>
        {item.title}
      </div>
    </a>
  );
}

export default ListItem;
