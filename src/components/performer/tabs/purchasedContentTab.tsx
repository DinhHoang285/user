'use client';

import { Spin } from 'antd';
import { useEffect, useRef, useState } from 'react';
import AdCard from '@components/advertisement/card/AdCard';
import MediaCard from '@components/media/card/MediaCard';
import MediaGridCard from '@components/media/card/MediaGridCard';
import { IPerformer } from '@interfaces/performer';
import { tokenTransactionService } from '@services/token-transaction.service';
import { useSession } from 'next-auth/react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useIntl } from 'react-intl';
import { useMainThemeLayout } from 'src/providers/main-layout.provider';
import { showError } from '@lib/message';
import style from './tabs.module.scss';

interface IProp {
  type: string,
  isGrid: boolean,
  activePer: string,
  keyword: string,
}

function PurchasedContentTabs({
  type, isGrid = false, activePer, keyword
}: IProp) {
  const { data: session } = useSession();
  const user: IPerformer = session?.user as IPerformer;
  const offset = useRef(0);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [fetching, setFetching] = useState(false);
  const { settings } = useMainThemeLayout();
  const intl = useIntl();

  const getDataPurchased = async (t: string) => {
    try {
      setFetching(true);
      const resp = await tokenTransactionService.userSearch({
        q: keyword,
        type: t,
        limit: 12,
        offset: offset.current * 12,
        sort: 'desc',
        activePer,
        sourceId: user._id
      });

      setData((prev) => [...prev, ...resp.data.data]);
      setTotal(resp.data.total);
    } catch (error) {
      showError('Error ==> ');
    } finally {
      setFetching(false);
    }
  };

  const getMore = () => {
    if (Math.round(total / 12) === offset.current) {
      return;
    }
    offset.current += 1;
    getDataPurchased(type);
  };

  useEffect(() => {
    setData([]);
    offset.current = 0;
    if (type.trim()) {
      getDataPurchased(type);
    } else {
      getDataPurchased('');
    }
  }, [type, activePer, keyword]);

  return (
    <InfiniteScroll
      dataLength={data.length}
      hasMore={total > data.length}
      loader={null}
      next={() => {
        !fetching && getMore();
      }}
      endMessage={null}
      scrollThreshold={0.7}
      style={{
        overflow: 'hidden'
      }}
    >
      <div className={isGrid ? style['grid-view'] : style['fixed-scroll']}>
        {data.length
          ? data.map((item: any) => {
            if (item.isAd && !isGrid && settings.enableAdvertisement) {
              return <AdCard feed={item} key={item._id} />;
            }
            if (!item.isAd) {
              if (isGrid) {
                return (
                  <MediaGridCard
                    media={item.objectInfo}
                    key={item._id}
                    isPageBookmark
                  />
                );
              }
              return (
                <MediaCard
                  feed={item.objectInfo}
                  performer={item?.objectInfo?.performer}
                  key={item._id}
                />
              );
            }
            return null;
          })
          : null}
      </div>
      {!data.length && !fetching && (
        <div className={style['fixed-scroll']}>
          <div className="noData">
            {intl.formatMessage({
              id: 'noPostWasFound',
              defaultMessage: 'No Post Was Found'
            })}
          </div>
        </div>
      )}
      {fetching && (
        <div className="text-center">
          <Spin />
        </div>
      )}
    </InfiniteScroll>
  );
}

export default PurchasedContentTabs;
