/* eslint-disable no-nested-ternary */

'use client';

import { OrderSearchFilter } from '@components/order/search-filter';
import OrderTableList from '@components/order/table-list';
import { showError } from '@lib/message';
import { orderService } from '@services/index';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

function PerformerOrderList() {
  const { data: session } = useSession();
  const user = session?.user;
  const limit = 10;

  const [pagination, setPagination] = useState({
    total: 0,
    current: 1,
    pageSize: limit
  });
  const [searching, setSearching] = useState(false);
  const [list, setList] = useState([]);
  const [filter, setFilter] = useState({});
  const [sort, setSort] = useState('desc');
  const [sortBy, setSortBy] = useState('updatedAt');

  const search = async () => {
    try {
      setSearching(true);
      const resp = await orderService.performerSearch({
        ...filter,
        limit: pagination.pageSize,
        offset: (pagination.current - 1) * limit,
        sort,
        sortBy
      });
      setList(resp.data.data);
      setPagination((prev) => ({
        ...prev,
        total: resp.data.total,
        pageSize: limit
      }));
    } catch (e) {
      showError(e);
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    search();
  }, [JSON.stringify(filter), JSON.stringify(pagination), sort, sortBy]);

  const handleTableChange = (pag, filters, sorter) => {
    setPagination((prev) => ({
      ...prev,
      current: pag.current
    }));
    setSortBy(sorter.field || 'updatedAt');
    setSort(sorter.order
      ? sorter.order === 'descend'
        ? 'desc'
        : 'asc'
      : 'desc');
  };

  const handleFilter = (values) => {
    setFilter((prev) => ({
      ...prev,
      ...values
    }));
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

export default PerformerOrderList;
