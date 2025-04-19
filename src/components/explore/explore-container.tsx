'use client';

import { AiOutlineSearch } from 'react-icons/ai';
import PageHeading from '@components/common/page-heading';
import CardTreding from '@components/trending/card-trending';
import { IUser } from '@interfaces/user';
import { showError } from '@lib/message';
import { exploreService } from '@services/explore.service';
import {
  Spin
} from 'antd';
import classNames from 'classnames';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import style from './explore.module.scss';

const FilterExplore = dynamic(() => import('@components/explore/filter-explore'), { ssr: false });

function ExplorePage() {
  const intl = useIntl();
  const { data: session } = useSession();
  const user: IUser = session?.user as IUser;
  const [filter, setFilter] = useState({} as any);
  const [listExplore, setListExplore] = useState([]);
  const [searching, setSearching] = useState(false);
  const router = useRouter();

  const handleFilter = (val) => {
    setFilter((prev) => ({ ...prev, ...val }));
  };

  const getListExplore = async () => {
    setSearching(true);
    try {
      const resp = await exploreService.search({ ...filter });
      setListExplore(resp.data);
    } catch (e) {
      const error = await e;
      showError(error.message || intl.formatMessage({ id: 'errorOccured', defaultMessage: 'Error occured, please try again later' }));
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    getListExplore();
  }, [filter]);

  useEffect(() => {
    if (user?.isPerformer) router.push('/404');
  }, []);

  return (
    <div className={classNames(style['explore-page'])}>
      <div className="main-container">
        <PageHeading title={intl.formatMessage({ id: 'discover', defaultMessage: 'Discover' })} icon={<AiOutlineSearch />} />
        <FilterExplore onFilter={handleFilter} />
        <div className={style['explore-content']}>
          <div className={style['explore-content-list']}>
            {listExplore?.length > 0
              && listExplore.map((item) => (
                <CardTreding item={item} key={item._id} />
              ))}
          </div>
          {!searching && !listExplore?.length && (
            <p style={{ textAlign: 'center' }}>{intl.formatMessage({ id: 'noExploreWasFound', defaultMessage: 'No explore was found' })}</p>
          )}
          {searching && (
            <div className={style['explore-loader']}>
              <Spin />
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

export default ExplorePage;
