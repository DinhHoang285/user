'use client';

import { SearchFilter } from '@components/common/search-filter';
import MediaList from '@components/feed/list/table-list';
import { showError, showSuccess } from '@lib/message';
import {
  feedService
} from '@services/index';

import {
  Button,
  Col
} from 'antd';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

export default function PerformerVideosList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    pageSize: 10,
    current: 1,
    total: 0
  });
  const [sort, setSort] = useState('desc');
  const [sortBy, setSortBy] = useState('updatedAt');
  const intl = useIntl();
  const getData = async () => {
    try {
      setLoading(true);
      const params = {
        status: 'inactive',
        sort,
        sortBy,
        limit: pagination.pageSize,
        offset: (pagination.current - 1) * pagination.pageSize,
        type: 'video'
      };
      const videos = await feedService.search(params);

      const data = videos.data.data.map((item) => ({ mediaInfo: { ...item, mediaType: 'video' } }));

      const { total } = videos.data;

      setItems([...data.sort((a, b) => b.updatedAt - a.updatedAt)]);
      setPagination({ ...pagination, total });
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [JSON.stringify(pagination), sort, sortBy]);

  const handleTableChange = (pag, filters, sorter) => {
    const pager = { ...pagination };
    pager.current = pag.current;
    setPagination(pager);
    setSortBy(sorter.field || 'updatedAt');
    // eslint-disable-next-line no-nested-ternary
    setSort(sorter.order
      ? sorter.order === 'descend'
        ? 'desc'
        : 'asc'
      : 'desc');
  };

  const handelDelete = async (item) => {
    try {
      if (!window.confirm(intl.formatMessage({
        id: 'confirmRemovePost',
        defaultMessage: 'All earnings related to this post will be refunded. Are you sure to remove it?'
      }))) {
        return;
      }
      await feedService.delete(item._id);
      showSuccess(intl.formatMessage({
        id: 'postDeleteSuccess',
        defaultMessage: 'Post deleted successfully'
      }));
    } catch (e) {
      showError(e);
    } finally {
      await getData();
    }
  };

  return (
    <>
      <SearchFilter
        type={[]}
        onSubmit={() => true}
        asideButton={(
          <Col
            md={4}
            xs={24}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              padding: '0'
            }}
          >
            <Button className="primary" style={{ flex: 1 }}>
              <Link href="/my-video/bulk-upload">
                {intl.formatMessage({ id: 'compPerformer-list-buttonBulkUpload', defaultMessage: 'Bulk upload' })}
                {' '}
                (
                {intl.formatMessage({ id: 'video', defaultMessage: 'Video' })}
                )
              </Link>
            </Button>
          </Col>
        )}
        changeOrderAside
      />
      <MediaList
        feeds={items}
        total={pagination.total}
        pageSize={pagination.pageSize * 4}
        searching={loading}
        onChange={handleTableChange}
        onDelete={handelDelete}
      />
    </>
  );
}
