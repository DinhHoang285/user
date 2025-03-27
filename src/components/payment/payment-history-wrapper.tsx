/* eslint-disable no-nested-ternary */

'use client';

import { SearchFilter } from '@components/common/search-filter';
import PaymentTableList from '@components/payment/table-list';
import { showError } from '@lib/message';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { paymentService } from 'src/services';

export default function PaymentHistoryWrapper() {
  const [pagination, setPagination] = useState({
    total: 0,
    pageSize: 10,
    current: 1
  });
  const [loading, setLoading] = useState(false);
  const [paymentList, setPaymentList] = useState([]);
  const [filter, setFilter] = useState({});
  const [sortBy, setSortBy] = useState('updatedAt');
  const [sort, setSort] = useState('desc');
  const intl = useIntl();

  const search = async () => {
    try {
      const resp = await paymentService.userSearch({
        ...filter,
        sort,
        sortBy,
        limit: pagination.pageSize,
        offset: (pagination.current - 1) * pagination.pageSize
      });
      setPaymentList(resp.data.data);
      setPagination({
        ...pagination,
        total: resp.data.total
      });
    } catch (e) {
      showError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    search();
  }, [JSON.stringify(filter), JSON.stringify(pagination), sort, sortBy]);

  const handleTableChange = async (pag, filters, sorter) => {
    setPagination({ ...pagination, current: pag.current });
    setSortBy(sorter.field || 'updatedAt');
    setSort(
      sorter.order
        ? sorter.order === 'descend'
          ? 'desc'
          : 'asc'
        : 'desc'
    );
  };

  const handleFilter = async (values) => {
    setFilter({ ...filter, ...values });
  };

  const statuses = [
    {
      key: '',
      text: intl.formatMessage({ id: 'allStatuses', defaultMessage: 'All Statuses' })
    },
    {
      key: 'created',
      text: intl.formatMessage({ id: 'created', defaultMessage: 'Created' })
    },
    {
      key: 'processing',
      text: intl.formatMessage({ id: 'processing', defaultMessage: 'Processing' })
    },
    {
      key: 'require_authentication',
      text: intl.formatMessage({ id: 'requireAuthentication', defaultMessage: 'Require authentication' })
    },
    {
      key: 'fail',
      text: intl.formatMessage({ id: 'fail', defaultMessage: 'Fail' })
    },
    {
      key: 'success',
      text: intl.formatMessage({ id: 'success', defaultMessage: 'Success' })
    },
    {
      key: 'canceled',
      text: intl.formatMessage({ id: 'cancelled', defaultMessage: 'Cancelled' })
    }
  ];

  return (
    <div>
      <SearchFilter
        statuses={statuses}
        onSubmit={handleFilter}
        searchWithPerformer
        dateRange
      />
      <PaymentTableList
        dataSource={paymentList}
        pagination={pagination}
        onChange={handleTableChange}
        loading={loading}
        rowKey="_id"
      />
    </div>
  );
}
