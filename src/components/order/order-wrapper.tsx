/* eslint-disable no-nested-ternary */

'use client';

import { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useSession } from 'next-auth/react';
import { orderService } from '@services/index';
import { OrderSearchFilter } from '@components/order/search-filter';
import OrderTableList from '@components/order/table-list';
import { showError } from '@lib/message';

export default function OrderWrapper() {
  const [pagination, setPagination] = useState({
    total: 0,
    pageSize: 10,
    current: 1
  });
  const [searching, setSearching] = useState(false);
  const [list, setList] = useState([]);
  const [limit] = useState(10);
  const [filter, setFilter] = useState({});
  const [sortBy, setSortBy] = useState('createdAt');
  const [sort, setSort] = useState('desc');
  const intl = useIntl();
  const { data: session } = useSession();
  const user = session?.user;

  const search = async (page = 1) => {
    try {
      setSearching(true);
      const resp = await orderService.userSearch({
        ...filter,
        limit,
        offset: (page - 1) * limit,
        sort,
        sortBy
      });
      setList(resp.data.data);
      setPagination({
        ...pagination,
        total: resp.data.total,
        pageSize: limit
      });
    } catch (e) {
      showError(
        intl.formatMessage({
          id: 'errorOccurredTryAgain',
          defaultMessage: 'Error occurred, please try again later'
        })
      );
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    search();
  }, [filter]);

  const handleTableChange = (pag, filters, sorter) => {
    const pager = { ...pagination };
    pager.current = pag.current;
    setPagination(pager);
    setSortBy(sorter.field || 'createdAt');
    setSort(
      sorter.order
        ? sorter.order === 'descend'
          ? 'desc'
          : 'asc'
        : 'desc'
    );
    search(pager.current);
  };

  const handleFilter = (values) => {
    setFilter({ ...filter, ...values });
  };

  return (
    <>
      <OrderSearchFilter onSubmit={handleFilter} />
      <OrderTableList
        user={user}
        dataSource={list}
        rowKey="_id"
        loading={searching}
        pagination={pagination}
        onChange={handleTableChange}
      />
    </>
  );
}
