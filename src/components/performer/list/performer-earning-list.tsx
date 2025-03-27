'use client';

import { TableListEarning } from '@components/earning/table-earning';
import { showError } from '@lib/message';
import { useEffect, useState } from 'react';
import { SearchFilter } from 'src/components/common/search-filter';
import { IEarning, IPerformerStatsListing } from 'src/interfaces';
import { earningService } from 'src/services';
import { isMobile } from 'react-device-detect';
import { useIntl } from 'react-intl';
import DownloadEarningButton from '@components/performer/buttons/down-earning-button';
import styles from './performer-earning-list.module.scss';
import PerformerEarningStasListing from './performer-earning-stas';
import PerformerPayoutRequestList from './performer-payout-repuest-list';

export default function PerformerEarningList() {
  const intl = useIntl();
  const [loading, setLoading] = useState(true);
  const [earning, setEarning] = useState<IEarning[] | undefined>(undefined);
  const [pagination, setPagination] = useState({ total: 0, current: 1, pageSize: 10 });
  const [stats, setStats] = useState<IPerformerStatsListing | undefined>(undefined);
  const [sortBy, setSortBy] = useState('updatedAt');
  const [sort, setSort] = useState('desc');
  const [type, setType] = useState('');
  const [dateRange, setDateRange] = useState<any>(null);

  const getData = async () => {
    try {
      setLoading(true);
      const { current, pageSize } = pagination;
      const resp = await earningService.performerSearch({
        limit: pageSize,
        offset: (current - 1) * pageSize,
        sort,
        sortBy,
        type,
        ...dateRange
      });
      setEarning(resp.data.data);
      setPagination((prev) => ({ ...prev, total: resp.data.total }));
    } catch (e) {
      showError(e);
    } finally {
      setLoading(false);
    }
  };

  const getPerformerStats = async () => {
    try {
      const resp = await earningService.performerStasListing({
        type,
        ...dateRange
      });

      if (resp.data) {
        setStats(resp.data);
      }
    } catch (e) {
      showError(e);
    }
  };

  useEffect(() => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    getPerformerStats();
  }, [type, dateRange]);

  useEffect(() => {
    getData();
    getPerformerStats();
  }, [JSON.stringify(pagination), sort, sortBy, type, dateRange]);

  const handleFilter = async (data: any) => {
    setType(data.mediaType);
    setDateRange({
      ...dateRange,
      fromDate: data.fromDate,
      toDate: data.toDate
    });
  };

  const handleTabsChange = async (pag: any, filters: any, sorter: any) => {
    setPagination((prev) => ({ ...prev, current: pag.current }));
    setSortBy(sorter.field || 'updatedAt');
    // eslint-disable-next-line no-nested-ternary
    setSort(sorter.order ? (sorter.order === 'descend' ? 'desc' : 'asc') : ('desc'));
  };

  return (
    <div className={styles['earning-transation']}>
      <div className={styles['earning-transation-stas']}>
        <PerformerEarningStasListing data={stats} />
      </div>
      <div className={styles['earning-transation-history']}>
        <header className={styles['earning-transation-header']}>
          {intl.formatMessage({ id: 'transactionHistory', defaultMessage: 'Transaction History' })}
        </header>
        <div className={styles['earning-transation-filter']}>
          <SearchFilter
            type={[
              { key: '', text: intl.formatMessage({ id: 'allTypes', defaultMessage: 'All types' }) },
              { key: 'product', text: intl.formatMessage({ id: 'product', defaultMessage: 'Product' }) },
              { key: 'gallery', text: intl.formatMessage({ id: 'gallery', defaultMessage: 'Gallery' }) },
              { key: 'feed', text: intl.formatMessage({ id: 'post', defaultMessage: 'Post' }) },
              { key: 'video', text: intl.formatMessage({ id: 'video', defaultMessage: 'Video' }) },
              { key: 'tip', text: intl.formatMessage({ id: 'tip', defaultMessage: 'Tip' }) },
              { key: 'monthly_subscription', text: intl.formatMessage({ id: 'monthlySubscription', defaultMessage: 'Monthly Subscription' }) },
              { key: 'quarterly_subscription', text: intl.formatMessage({ id: 'quarterlySubscription', defaultMessage: 'Quarterly Subscription' }) },
              { key: 'half_yearly_subscription', text: intl.formatMessage({ id: 'yearlySubscription', defaultMessage: 'Yearly Subscription' }) },
              { key: 'yearly_subscription', text: intl.formatMessage({ id: 'halfYearlySubscription', defaultMessage: 'Half-yearly Subscription' }) }
            ]}
            onSubmit={handleFilter}
            dateRange
            asideButton={<DownloadEarningButton />}
          />
        </div>
        <div className="table-responsive">
          <TableListEarning
            dataSource={earning}
            rowKey="_id"
            pagination={{
              ...pagination,
              position: ['bottomCenter'],
              showSizeChanger: false,
              simple: isMobile
            }}
            loading={loading}
            onChange={handleTabsChange}
          />
        </div>
      </div>
      <div className={styles['earning-transation-payout']}>
        <header className={styles['earning-transation-header']}>
          {intl.formatMessage({ id: 'payoutRequests', defaultMessage: 'Payout Requests' })}
        </header>
        <main className={styles['earning-transation-main']}>
          <PerformerPayoutRequestList />
        </main>
      </div>
    </div>
  );
}
