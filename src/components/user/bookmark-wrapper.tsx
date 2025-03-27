/* eslint-disable no-nested-ternary */

'use client';

import { Spin } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import InfiniteScroll from 'react-infinite-scroll-component';
import AdCard from '@components/advertisement/card/AdCard';
import MediaCard from '@components/media/card/MediaCard';
import MediaGridCard from '@components/media/card/MediaGridCard';
import { reactionService } from '@services/reaction.service';
import { settingService } from '@services/setting.service';
import { showError } from '@lib/message';
import style from './tabs.module.scss';

interface IProp {
  type: string;
  isGrid: boolean;
  activePer: string;
}

export default function BookmarkTab({ type, isGrid = false, activePer }: IProp) {
  const offset = useRef(0);
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [fetching, setFetching] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const intl = useIntl();

  const fetchSettings = async () => {
    try {
      const resp = await settingService.all();
      setSettings(resp);
    } catch (error) {
      showError(
        intl.formatMessage({ id: 'errorFetchingSettings', defaultMessage: 'Error fetching settings:' })
      );
    }
  };

  const getDataBookmarks = async (t: string) => {
    try {
      setFetching(true);
      const resp = await reactionService.getBookmarks({
        objectType: t,
        limit: 12,
        offset: offset.current * 12,
        sort: 'desc',
        activePer
      });

      setData((prev) => [...prev, ...resp.data.data]);
      setTotal(resp.data.total);
    } catch (error) {
      showError(
        intl.formatMessage({ id: 'errorFetchingBookmarks', defaultMessage: 'Error fetching bookmarks:' })
      );
    } finally {
      setFetching(false);
    }
  };

  const getMore = () => {
    if (total <= data.length) return;
    offset.current += 1;
    getDataBookmarks(type);
  };

  useEffect(() => {
    setData([]);
    offset.current = 0;
    getDataBookmarks(type.trim() || '');
  }, [type, activePer]);

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <InfiniteScroll
      dataLength={data.length}
      hasMore={total > data.length}
      next={fetching ? undefined : getMore}
      scrollThreshold={0.7}
      loader={<div className="text-center"><Spin /></div>}
      style={{ overflow: 'hidden' }}
    >
      <div className={isGrid ? style['grid-view'] : style['fixed-scroll']}>
        {data.length > 0 ? (
          data.map((item) => {
            if (item.isAd && !isGrid && settings?.enableAdvertisement) {
              return <AdCard feed={item} key={item._id} />;
            }
            return isGrid ? (
              <MediaGridCard media={item.objectInfo} key={item._id} isPageBookmark />
            ) : (
              <MediaCard feed={item.objectInfo} key={item._id} isPageBookmark performer={item?.objectInfo?.performer} />
            );
          })
        ) : !fetching ? (
          <div className={style['fixed-scroll']}>
            <div className="noData">
              {intl.formatMessage({ id: 'noPostWasFound', defaultMessage: 'No Post Was Found' })}
            </div>
          </div>
        ) : null}
      </div>
    </InfiniteScroll>
  );
}
