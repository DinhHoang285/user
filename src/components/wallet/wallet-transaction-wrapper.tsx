/* eslint-disable no-nested-ternary */

'use client';

import { SearchFilter } from '@components/common/search-filter';
import PaymentTableList from '@components/user/payment-token-history-table';
import { showError } from '@lib/message';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { ITransaction } from 'src/interfaces';
import { tokenTransactionService } from 'src/services';

export default function WalletTransactionWrapper() {
  const [loading, setLoading] = useState(true);
  const [paymentList, setPaymentList] = useState<ITransaction[]>();
  const [pagination, setPagination] = useState({
    total: 0,
    pageSize: 10,
    current: 1
  });
  const [sortBy, setSortBy] = useState('createdAt');
  const [sort, setSort] = useState('desc');
  const [filter, setFilter] = useState({ mediaType: 'all' });
  const intl = useIntl();

  const search = async () => {
    try {
      setLoading(true);
      const query = {
        ...filter,
        type: filter.mediaType === 'all' ? '' : filter.mediaType,
        sort,
        sortBy,
        limit: pagination.pageSize,
        offset: (pagination.current - 1) * pagination.pageSize
      };
      const resp = await tokenTransactionService.userSearch(query);
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

  const handleTableChange = (pag, filters, sorter) => {
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

  const handleFilter = (values) => {
    setFilter({ ...filter, ...values });
  };

  const type = [
    {
      key: 'all',
      text: intl.formatMessage({ id: 'allType', defaultMessage: 'All types' })
    },
    {
      key: 'feed',
      text: intl.formatMessage({ id: 'post', defaultMessage: 'Post' })
    },
    {
      key: 'message',
      text: intl.formatMessage({ id: 'message', defaultMessage: 'Message' })
    },
    {
      key: 'product',
      text: intl.formatMessage({ id: 'product', defaultMessage: 'Product' })
    },
    {
      key: 'gallery',
      text: intl.formatMessage({ id: 'gallery', defaultMessage: 'Gallery' })
    },
    {
      key: 'video',
      text: intl.formatMessage({ id: 'video', defaultMessage: 'Video' })
    },
    {
      key: 'tip',
      text: intl.formatMessage({ id: 'creatorTip', defaultMessage: 'Creator Tip' })
    },
    {
      key: 'stream_tip',
      text: intl.formatMessage({ id: 'streamingTip', defaultMessage: 'Streaming Tip' })
    },
    {
      key: 'public_chat',
      text: intl.formatMessage({ id: 'paidStreaming', defaultMessage: 'Paid Streaming' })
    },
    {
      key: 'monthly_subscription',
      text: intl.formatMessage({ id: 'monthlySubscription', defaultMessage: 'Monthly Subscription' })
    },
    {
      key: 'quarterly_subscription',
      text: intl.formatMessage({ id: 'quarterlySubscription', defaultMessage: 'Quarterly Subscription' })
    },
    {
      key: 'half_yearly_subscription',
      text: intl.formatMessage({ id: 'halfYearlySubscription', defaultMessage: 'Half-Yearly Subscription' })
    },
    {
      key: 'yearly_subscription',
      text: intl.formatMessage({ id: 'yearlySubscription', defaultMessage: 'Yearly Subscription' })
    }
  ];

  return (
    <div>
      <SearchFilter
        type={type}
        typeDefault="all"
        searchWithPerformer
        onSubmit={handleFilter}
        dateRange
      />
      <PaymentTableList
        dataSource={paymentList}
        pagination={pagination}
        onChange={handleTableChange}
        rowKey="_id"
        loading={loading}
      />
    </div>
  );
}
