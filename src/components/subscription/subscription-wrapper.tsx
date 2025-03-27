'use client';

import { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useSession } from 'next-auth/react';
import { SearchFilter } from '@components/common';
import { UserTableListSubscription } from '@components/subscription/user-table-list-subscription';
import { showError, showSuccess } from '@lib/message';
import { subscriptionService } from '@services/index';
import { ISubscription } from 'src/interfaces';
import { useMainThemeLayout } from 'src/providers/main-layout.provider';

export default function SubscriptionWrapper() {
  const { data: session } = useSession();
  const user = session?.user || {};

  const [pagination, setPagination] = useState({
    total: 0,
    pageSize: 10,
    current: 1
  });
  const [filter, setFilter] = useState({});
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sort, setSort] = useState('desc');
  const intl = useIntl();
  const { setSubscriptionModal } = useMainThemeLayout();

  const getData = async () => {
    try {
      setLoading(true);
      const resp = await subscriptionService.userSearch({
        ...filter,
        sort,
        sortBy,
        limit: pagination.pageSize,
        offset: (pagination.current - 1) * pagination.pageSize
      });
      setList(resp.data.data);
      setPagination({ ...pagination, total: resp.data.total });
    } catch (e) {
      showError(e);
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = async (page, filters, sorter) => {
    setPagination(page);
    if (sorter) {
      setSortBy(sorter.field || 'createdAt');
      // eslint-disable-next-line no-nested-ternary
      setSort(sorter.order ? (sorter.order === 'descend' ? 'desc' : 'asc') : ('desc'));
    }
  };

  const handleFilter = async (values) => {
    setFilter((f) => ({ ...f, ...values }));
  };

  useEffect(() => {
    getData();
  }, [JSON.stringify(filter), JSON.stringify(pagination), sort, sortBy]);

  const cancelSubscription = async (subscription: ISubscription) => {
    if (
      !window.confirm(
        intl.formatMessage({
          id: 'confirmCancelSubscription',
          defaultMessage: 'Are you sure you want to cancel this subscription!'
        })
      )
    ) return;
    try {
      await subscriptionService.cancelSubscription(
        subscription._id,
        subscription.paymentGateway
      );
      showSuccess(
        intl.formatMessage({
          id: 'cancelSubscriptionSuccess',
          defaultMessage: 'Subscription cancelled successfully'
        })
      );
      getData();
    } catch (e) {
      showError(e);
    }
  };

  const activeSubscription = (subscription: ISubscription) => {
    const { performerInfo: performer } = subscription;
    if (user.isPerformer || !performer) return;

    setSubscriptionModal({ open: true, performer, subscriptionType: subscription.subscriptionType });
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
    <div>
      <SearchFilter
        statuses={statuses}
        subscriptionTypes={types}
        searchWithPerformer
        onSubmit={handleFilter}
      />
      <div className="table-responsive">
        <UserTableListSubscription
          dataSource={list}
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
          rowKey="_id"
          cancelSubscription={cancelSubscription}
          activeSubscription={activeSubscription}
        />
      </div>
    </div>
  );
}
