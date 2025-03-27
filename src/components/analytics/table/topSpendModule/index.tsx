/* eslint-disable react/require-default-props */

'use client';

import { analyticsService } from '@services/analytics.service';
import { Card, Table, Tag } from 'antd';
import React, { useEffect } from 'react';
import { formatMoney, formatUnit } from '@lib/string';
import SelectTime from '@components/analytics/actions/selectTime';
import { useIntl } from 'react-intl';
import styles from './index.module.scss';

interface IProps {
  title: string,
  module?: string
}

function TopSpendByModule({ title, module }: IProps) {
  const intl = useIntl();
  const columns = [
    {
      title: intl.formatMessage({ id: 'rank', defaultMessage: 'Rank' }),
      key: 'Rank',
      render: (row, _, index) => (
        <span>
          #
          {formatUnit(index + 1)}
        </span>
      )
    },
    {
      title: intl.formatMessage({ id: 'user', defaultMessage: 'User' }),
      key: 'user',
      render: (row) => {
        const { user } = row;
        return (
          <div className={styles['table-row-user']}>
            <img className={styles['table-row-user-avatar']} src={user?.avatar || '/no-avatar.jpg'} alt="" />
            {user?.username || 'N/A'}
          </div>
        );
      },
      width: 200
    },
    {
      title: intl.formatMessage({ id: 'spendingTimes', defaultMessage: 'Spending Times' }),
      key: 'quantity',
      render: (row) => (
        <span>
          {formatUnit(row.totalQuantity)}
        </span>

      )
    },
    {
      title: intl.formatMessage({ id: 'amount', defaultMessage: 'Amount' }),
      key: 'amount',
      render: (row) => (
        <Tag color={onGetColorByAmount(row.totalAmount)}>
          {formatMoney(row.totalAmount)}
          €
        </Tag>
      )
    }
  ];

  const [appState, setAppState] = React.useState({
    loading: true,
    data: [],
    month: null
  });

  const onGetColorByAmount = (amount) => {
    if (amount >= 100) {
      return '#87d068';
    }
    if (amount >= 50) {
      return '#2db7f5';
    }
    return '#108ee9';
  };

  const onChangeAppState = (obj) => {
    setAppState((prev) => ({ ...prev, ...obj }));
  };

  const getData = async () => {
    try {
      onChangeAppState({ loading: true });
      const query = {
        module,
        month: appState.month,
        limit: 10,
        skip: 0
      };
      const resp = await analyticsService.getAnalyticsTopSpend(query);
      onChangeAppState({ loading: false, data: resp.data });
    } catch (error) {
      onChangeAppState({ loading: false });
    }
  };

  const onChangeTime = async (time) => {
    onChangeAppState({ month: time });
  };

  useEffect(() => {
    getData();
  }, [appState.month]);

  return (
    <Card size="small" title={title} extra={<SelectTime onChange={onChangeTime} />}>
      <div className={styles['table-wrapper']}>
        <Table
          columns={columns}
          dataSource={appState.data}
          pagination={false}
          size="small"
          bordered={false}
          loading={appState.loading}
        />
      </div>
    </Card>
  );
}

TopSpendByModule.propTypes = {};

export default TopSpendByModule;
