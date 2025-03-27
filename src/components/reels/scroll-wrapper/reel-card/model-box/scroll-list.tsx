/* eslint-disable @typescript-eslint/no-unused-vars */
import { showError } from '@lib/message';
import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useIntl } from 'react-intl';
import { IFeed, IVideo } from 'src/interfaces';
import { feedService } from '@services/feed.service';
import ReelListing from './Listing';

interface IProps {
  query?: any;
  loading?: boolean;
  meta?: any;
  canLoadmore?: boolean;
}

function ScrollListReels({
  query,
  loading,
  meta,
  canLoadmore
}: IProps) {
  const [fetching, setFetching] = useState<boolean>(loading || true);
  const [items, setItems] = useState<IFeed[]>([]);
  const [total, setTotal] = useState(0);
  const offset = useRef<number>(0);
  const intl = useIntl();

  const getItems = async (more = false) => {
    try {
      setFetching(true);
      const resp = await feedService.userSearch({
        limit: 12,
        offset: offset.current * 12,
        ...query,
        type: 'reel'
      });
      !more ? setItems(resp.data.data) : setItems([...items, ...resp.data.data]);
      setTotal(resp.data.total);
    } catch (e) {
      showError(e);
    } finally {
      setFetching(false);
    }
  };

  const getMore = () => {
    offset.current += 1;
    getItems(true);
  };

  useEffect(() => {
    offset.current = 0;
    getItems();
  }, [JSON.stringify(query)]);

  return (
    <InfiniteScroll
      dataLength={items.length}
      hasMore={canLoadmore || total > items.length}
      loader={null}
      next={() => {
        !fetching && getMore();
      }}
      endMessage={null}
      scrollThreshold={0.9}
      style={{
        overflow: 'hidden'
      }}
    >
      <ReelListing reels={items} />
      {!items.length && !fetching && <div className="noData">{intl.formatMessage({ id: 'noDataFound', defaultMessage: 'No data was found' })}</div>}
    </InfiniteScroll>
  );
}

ScrollListReels.defaultProps = {
  query: {},
  loading: false,
  meta: [],
  canLoadmore: false
};

export default ScrollListReels;
