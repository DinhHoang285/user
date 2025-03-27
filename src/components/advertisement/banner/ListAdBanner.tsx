import { IAdvertisement } from '@interfaces/advertisement';
import { Spin } from 'antd';
import { useIntl } from 'react-intl';
import styles from './ListAdBanner.module.scss';
import ListItem from './ListItem';

interface IProps {
  ads: IAdvertisement[],
  loading: boolean
}
function ListAdBanner({ ads, loading }: IProps) {
  const intl = useIntl();

  return (
    <div className={styles['banner-wrapper']}>
      <header className={styles['banner-header']}>
        {intl.formatMessage({ id: 'advertisements', defaultMessage: 'Advertisements' })}
      </header>
      <div className={styles['banner-main']}>
        {
          ads.map((item: IAdvertisement) => <ListItem item={item} />)
        }
        {loading && ads.length === 0 && <Spin />}
      </div>
    </div>
  );
}

export default ListAdBanner;
