'use client';

import PageHeading from '@components/common/page-heading';
import CardTreding from '@components/trending/card-trending';
import { trendingService } from '@services/trending.service';
import {
  Spin
} from 'antd';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import {
  TrendingIcon
} from 'src/icons';
import { IUser } from '@interfaces/user';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { showError } from '@lib/message';
import style from './trending.module.scss';

const FilterBar = dynamic(() => import('@components/trending/filter-bar'), { ssr: false });

function TrendingPage() {
  const intl = useIntl();
  const { data: session } = useSession();
  const user: IUser = session?.user as IUser;
  const [filter, setFilter] = useState({} as any);
  const [data, setData] = useState([]);
  const [searching, setSearching] = useState(false);
  const router = useRouter();

  const handleFilter = (field: string, value: any) => {
    setFilter({ ...filter, [field]: value });
  };

  const getData = async () => {
    setSearching(true);
    try {
      const resp = await trendingService.search({
        ...filter
      });

      setData(resp.data);
    } catch (e) {
      const error = await e;
      showError(error.message
        || intl.formatMessage({ id: 'errorOccured', defaultMessage: 'Error occured, please try again later' }));
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    getData();
  }, [filter]);

  useEffect(() => {
    if (user?.isPerformer) router.push('/404');
  }, []);

  return (
    <div className={classNames(style['trending-page'])}>
      <div className="main-container">
        <PageHeading title={intl.formatMessage({ id: 'trending', defaultMessage: 'Trending' })} icon={<TrendingIcon />} />
        <FilterBar onFilter={handleFilter} />
        <div className={style['trending-content']}>
          <div className={style['trending-content-list']}>
            {data.length > 0
              && data.map((item) => (
                <CardTreding item={item} key={item._id} />
              ))}
          </div>
          {!searching && !data.length && (
            <p style={{ textAlign: 'center' }}>{intl.formatMessage({ id: 'noExploreWasFound', defaultMessage: 'No explore was found' })}</p>
          )}
          {searching && (
            <div className={style['trending-loader']}>
              <Spin />
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

export default TrendingPage;
