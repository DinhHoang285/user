'use client';

import { SearchFilter } from '@components/common/search-filter';
import { PerformerTableListSubscription } from '@components/subscription/performer-table-list-subscription';
import { showError } from '@lib/message';
import { subscriptionService } from '@services/subscription.service';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { ISubscription } from 'src/interfaces';

function PerformerSubscriberList() {
  const [subscriptionList, setSubscriptionList] = useState<ISubscription[]>();
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    pageSize: 10,
    current: 1,
    total: 0
  });
  const [sort, setSort] = useState('desc');
  const [sortBy, setSortBy] = useState('updatedAt');
  const [filter, setFilter] = useState({});
  const intl = useIntl();
  const getData = async () => {
    try {
      setLoading(true);
      const resp = await subscriptionService.search({
        ...filter,
        sort,
        sortBy,
        limit: pagination.pageSize,
        offset: (pagination.current - 1) * pagination.pageSize
      });
      setSubscriptionList(resp.data.data);
      setPagination({ ...pagination, total: resp.data.total });
    } catch (e) {
      showError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [JSON.stringify(filter), JSON.stringify(pagination), sort, sortBy]);

  const handleFilter = (values) => {
    setFilter({ ...filter, ...values });
  };

  const handleTabChange = (pag, filters, sorter) => {
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

  const statuses = [
    {
      key: '',
      text: intl.formatMessage({ id: 'allStatuses', defaultMessage: 'All Statuses' })
    },
    {
      key: 'active',
      text: intl.formatMessage({ id: 'active', defaultMessage: 'Active' })
    },
    {
      key: 'deactivated',
      text: intl.formatMessage({ id: 'inactive', defaultMessage: 'Inactive' })
    },
    {
      key: 'suspended',
      text: intl.formatMessage({ id: 'suspended', defaultMessage: 'Suspended' })
    }
  ];
  const types = [
    {
      key: '',
      text: intl.formatMessage({ id: 'allTypes', defaultMessage: 'All Types' })
    },
    {
      key: 'free',
      text: intl.formatMessage({ id: 'freeSubscription', defaultMessage: 'Free Subscription' })
    },
    {
      key: 'monthly',
      text: intl.formatMessage({ id: 'monthlySubscription', defaultMessage: 'Monthly Subscription' })
    },
    {
      key: 'yearly',
      text: intl.formatMessage({ id: 'yearlySubscription', defaultMessage: 'Yearly Subscription' })
    }
  ];
  return (
    <>
      <SearchFilter
        subscriptionTypes={types}
        statuses={statuses}
        dateRange
        onSubmit={handleFilter}
      />
      <div className="table-responsive">
        <PerformerTableListSubscription
          dataSource={subscriptionList}
          pagination={pagination}
          loading={loading}
          onChange={handleTabChange}
          rowKey="_id"
        />
      </div>
    </>
  );
}

export default PerformerSubscriberList;
