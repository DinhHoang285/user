/* eslint-disable no-nested-ternary */

'use client';

import { showError } from '@lib/message';
import { payoutRequestService } from '@services/index';
import { Button } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import PayoutRequestList from 'src/components/payout-request/table';
import { shortenLargeNumber } from '@lib/number';
import { useSession } from 'next-auth/react';
import styles from './performer-payout-repuest-list.module.scss';

function PerformerPayoutRequestList() {
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
  const [canculate, setCanculate] = useState({});

  const { data: session } = useSession();
  const currentUser = session?.user;

  const router = useRouter();

  const getData = async () => {
    try {
      setLoading(true);
      const resp = await payoutRequestService.search({
        sort,
        sortBy,
        limit: pagination.pageSize,
        offset: (pagination.current - 1) * pagination.pageSize
      });
      setItems(resp.data.data);
      setPagination((prev) => ({ ...prev, total: resp.data.total }));
    } catch (e) {
      showError(e);
    } finally {
      setLoading(false);
    }
  };

  const getCanculate = async () => {
    try {
      const resp = await payoutRequestService.calculate();
      if (resp.data) setCanculate(resp.data);
    } catch (error) {
      showError(error);
    }
  };

  useEffect(() => {
    getCanculate();
  }, []);

  useEffect(() => {
    getData();
  }, [JSON.stringify(pagination), sort, sortBy]);

  const handleTableChange = (pag, filters, sorter) => {
    const pager = { ...pagination };
    pager.current = pag.current;
    setPagination(pager);
    setSortBy(sorter.field || 'updatedAt');
    setSort(sorter.order ? (sorter.order === 'descend' ? 'desc' : 'asc') : 'desc');
  };

  return (
    <div className={styles['transation-payout']}>
      <div className={styles['transation-action']}>
        <div className={styles['transation-nav']}>
          <div className={styles['transation-nav-item']}>
            <div className={styles['transation-nav-lable']}>
              {intl.formatMessage({ id: 'balance', defaultMessage: 'Balance' })}
            </div>
            <div className={styles['transation-nav-line']} />
            <div className={styles['transation-nav-value']}>
              €
              {shortenLargeNumber((currentUser?.balance || 0).toFixed(2))}
            </div>
          </div>
          <div className={styles['transation-nav-item']}>
            <div className={styles['transation-nav-lable']}>
              {intl.formatMessage({ id: 'withdrew', defaultMessage: 'withdrew' })}
            </div>
            <div className={styles['transation-nav-line']} />
            <div className={styles['transation-nav-value']}>
              €
              {shortenLargeNumber(((canculate as any)?.previousPaidOut || 0).toFixed(2))}
            </div>
          </div>
        </div>
        <div className={styles['transation-btn']}>
          <Button
            type="primary"
            onClick={() => router.push('/payout-request/create')}
          >
            {intl.formatMessage({ id: 'requestAPayout', defaultMessage: 'Request a Payout' })}
          </Button>
        </div>
      </div>
      <div className="table-responsive">
        <PayoutRequestList
          payouts={items}
          searching={loading}
          total={pagination.total}
          onChange={handleTableChange}
          pageSize={pagination.pageSize}
        />
      </div>
    </div>
  );
}

export default PerformerPayoutRequestList;
