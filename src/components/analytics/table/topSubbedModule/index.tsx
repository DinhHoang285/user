/* eslint-disable react/require-default-props */

'use client';

import { analyticsService } from '@services/analytics.service';
import { Card, Table, Tag } from 'antd';
import React, { useEffect } from 'react';
import { formatMoney, formatUnit } from '@lib/string';
import { useIntl } from 'react-intl';
import styles from './index.module.scss';

interface IProps {
  title: string,
}

function TopSubbedByModule({ title }: IProps) {
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
      title: intl.formatMessage({ id: 'description', defaultMessage: 'Description' }),
      key: 'description',
      render: (row) => (
        <span className={styles['table-description']}>
          {row.description}
        </span>
      ),
      size: 50
    },
    {
      title: intl.formatMessage({ id: 'quantity', defaultMessage: 'Quantity' }),
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
    },
    {
      title: intl.formatMessage({ id: 'duration', defaultMessage: 'Duration' }),
      key: 'duration',
      render: (row) => (
        <Tag color={onGetColorByAmount(row.totalDuration)}>
          {formatUnit(row.totalDuration)}
          {' '}
          days
        </Tag>
      )
    }
  ];

  const [appState, setAppState] = React.useState({
    loading: true,
    data: []
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
        module: 'subcription',
        // month: appState.time.toDateString()
        limit: 10,
        skip: 0
      };
      const resp = await analyticsService.getAnalyticsTopSubbed(query);

      onChangeAppState({ loading: false, data: resp.data });
    } catch (error) {
      onChangeAppState({ loading: false });
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Card size="small" title={title}>
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

TopSubbedByModule.propTypes = {};

export default TopSubbedByModule;
