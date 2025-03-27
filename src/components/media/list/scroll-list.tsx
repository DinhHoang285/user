'use client';

import AdCard from '@components/advertisement/card/AdCard';
import MediaCard from '@components/media/card/MediaCard';
import MediaGridCard from '@components/media/card/MediaGridCard';
import { IFeed } from '@interfaces/feed';
import { showError, showSuccess } from '@lib/message';
import { feedService } from '@services/feed.service';
import { Spin } from 'antd';
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import withHydrationOnDemand from 'react-hydration-on-demand';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useIntl } from 'react-intl';
import { TABLE_LIMIT } from 'src/constants';
import { useMainThemeLayout } from 'src/providers/main-layout.provider';
import style from './scroll-list.module.scss';

const MediaCardHydration = withHydrationOnDemand({ on: ['idle', 'visible'] })(
  MediaCard
);
const MediaGridCardHydration = withHydrationOnDemand({ on: ['idle', 'visible'] })(
  MediaGridCard
);
const AdCardHydration = withHydrationOnDemand({ on: ['idle', 'visible'] })(
  AdCard
);

interface IProps {
  query?: any;
  isGrid?: boolean;
}

function ScrollListMedia({ query, isGrid = false }: IProps) {
  const intl = useIntl();
  const { settings, setAutoPlayVideo, autoPlayVideo } = useMainThemeLayout();
  const [fetching, setFetching] = useState<boolean>(true);
  const [items, setItems] = useState<IFeed[]>([]);
  const [total, setTotal] = useState(0);
  const [exculeIds, setExculeIds] = useState<string[]>([]);
  const page = useRef<number>(1);
  const nextItem = useRef<IFeed>(null);
  const { data: session } = useSession();

  const getItems = async (more = false) => {
    try {
      setFetching(true);
      const payload = {
        limit: TABLE_LIMIT,
        offset: (page.current - 1) * TABLE_LIMIT,
        exculeIds,
        isTrash: false,
        type: query.mediaType,
        ...query
      };

      const resp = await feedService.userSearch(payload);
      const newData = !more ? resp.data.data : [...items, ...resp.data.data];
      const adIds = newData.filter((item: any) => item.isAd);
      const ids = adIds.map((item: any) => item._id);

      setExculeIds(ids);
      setItems(newData);
      if (!more && newData.length) {
        setAutoPlayVideo({ currentIdRunning: newData[0].mediaInfo._id });
      }
      setTotal(resp.data.total);
      setFetching(false);
    } catch (e) {
      setFetching(false);
    } finally {
      setFetching(false);
    }
  };

  const getMore = () => {
    if (page.current * 12 >= Number(total)) {
      setAutoPlayVideo({ autoPlayBtn: 'off' });
    } else {
      page.current += 1;
      getItems(true);
    }
  };

  const onPin = async (idMedia: any) => {
    const mediaIndex = items.findIndex((item: any) => item._id === idMedia);
    const foundMedia = items[mediaIndex];
    if (
      !window.confirm(
        foundMedia.isPinned
          ? intl.formatMessage({
            id: 'unpinConfirm',
            defaultMessage: 'Unpin this post from your profile'
          })
          : intl.formatMessage({
            id: 'pinConfirm',
            defaultMessage: 'Pin this post to your profile?'
          })
      )
    ) {
      return;
    }

    try {
      await feedService.pinPostProfile(foundMedia._id);
      setItems([]);
      getItems();
      showSuccess(
        `${foundMedia.isPinned
          ? intl.formatMessage({ id: 'unpinned', defaultMessage: 'Unpinned' })
          : intl.formatMessage({ id: 'pinned', defaultMessage: 'Pinned' })
        } ${intl.formatMessage({ id: 'postSuccessfully', defaultMessage: 'post successfully' })}`
      );
    } catch (e) {
      showError(e);
    }
  };

  useEffect(() => {
    page.current = 1;
    getItems();
  }, [JSON.stringify(query)]);

  useEffect(() => {
    if (autoPlayVideo.currentIdRunning && items && items.length > 0) {
      let currentIndex = items.findIndex((item) => item.mediaInfo?._id === autoPlayVideo.currentIdRunning);
      nextItem.current = items[currentIndex + 1]?.mediaInfo;

      if (currentIndex + 1 === items.length) {
        getMore();
      }

      let canView = nextItem.current?.isFree
        || (nextItem.current?.isSale && nextItem.current?.isBought)
        || (nextItem.current?.isSub && nextItem.current?.isSubscribed)
        || (nextItem.current?.performer?._id === session?.user?._id);

      let attempts = 0;
      while (nextItem.current && !canView && attempts < items.length) {
        currentIndex += 1;
        nextItem.current = items[currentIndex + 1]?.mediaInfo;

        canView = nextItem.current?.isFree
          || (nextItem.current?.isSale && nextItem.current?.isBought)
          || (nextItem.current?.isSub && nextItem.current?.isSubscribed);

        attempts += 1;
      }

      if (nextItem.current && canView && autoPlayVideo.autoPlayBtn === 'on') {
        const nextElement = document.getElementById(nextItem.current?._id);
        nextElement && nextElement.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
      }
    }
  }, [autoPlayVideo.currentIdRunning, items, nextItem.current]);

  useEffect(() => {
    if (items.length > 0 && autoPlayVideo.autoPlayBtn === 'on') {
      nextItem.current = items[0]?.mediaInfo;

      let currentIndex = 0;
      const canView = nextItem.current?.isFree
        || (nextItem.current?.isSale && nextItem.current?.isBought)
        || (nextItem.current?.isSub && nextItem.current?.isSubscribed);

      while (nextItem.current && !canView) {
        nextItem.current = items[currentIndex + 1]?.mediaInfo;
        currentIndex += 1;
        if (!nextItem.current) break;
      }

      if (nextItem.current && canView) {
        const nextElement = document.getElementById(nextItem.current?._id);
        nextElement && nextElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      }
    }
  }, [autoPlayVideo.autoPlayBtn]);

  return (
    <InfiniteScroll
      dataLength={items.length}
      hasMore={total > items.length}
      loader={null}
      next={() => !fetching && getMore()}
      endMessage={null}
      scrollThreshold={0.9}
    >
      <div className={isGrid ? style['grid-view'] : style['fixed-scroll']}>
        {items?.map((item: IFeed) => {
          if (item.isAd && !isGrid && settings.enableAdvertisement) {
            return <AdCardHydration feed={item} key={`adCard_${item._id}`} />;
          }
          if (isGrid) return <MediaGridCardHydration media={item} key={`mediaCard_${item._id}`} />;
          if (item._id) {
            return (
              <MediaCardHydration
                key={item._id}
                feed={item}
                performer={item?.performer}
                onPin={onPin}
              />
            );
          }
          return null;
        })}
      </div>
      {!items.length && !fetching && (
        <div className={style['fixed-scroll']}>
          <div className="noData">
            {intl.formatMessage({
              id: 'noPost',
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

export default ScrollListMedia;
