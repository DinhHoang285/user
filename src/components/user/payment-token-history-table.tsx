'use client';

import { formatDate } from '@lib/date';
import {
  Avatar, Table, Tag, Tooltip
} from 'antd';
import Link from 'next/link';
import { isMobile } from 'react-device-detect';
import { useIntl } from 'react-intl';
import { ITransaction } from 'src/interfaces';
import styles from './payment-token-history-table.module.scss';

interface IProps {
  dataSource: ITransaction[];
  pagination: {};
  rowKey: string;
  loading: boolean;
  onChange: Function;
}

function PaymentTableList({
  dataSource,
  pagination,
  rowKey,
  loading,
  onChange
}: IProps) {
  const intl = useIntl();
  const columns = [
    {
      title: intl.formatMessage({ id: 'id', defaultMessage: 'ID' }),
      dataIndex: '_id',
      key: 'id',
      render(data, record) {
        let href = '/';
        switch (record.target) {
          case 'performer':
            href = `/${record?.performerInfo?.username || record?.performerInfo?._id}`;
            break;
          case 'message':
            href = `/messages?toId=${record?.performerId}&toSource=performer`;
            break;
          case 'feed':
            href = `/post/${record?.targetId}`;
            break;
          case 'product':
            href = `/product/${record?.targetId}`;
            break;
          case 'video':
            href = `/video/${record?.targetId}`;
            break;
          case 'gallery':
            href = `/gallery/${record?.targetId}`;
            break;
          default: null;
        }
        return (
          <Link href={href}>
            {record._id.slice(16, 24)}
          </Link>
        );
      }
    },
    {
      title: intl.formatMessage({ id: 'creator', defaultMessage: 'Creator' }),
      dataIndex: 'performerInfo',
      key: 'performer',
      render(data) {
        return (
          <span style={{ whiteSpace: 'nowrap' }}>
            <Avatar src={data?.avatar || '/no-avatar.jpg'} />
            {' '}
            {data?.name || data?.username || 'N/A'}
          </span>
        );
      }
    },
    {
      title: intl.formatMessage({ id: 'description', defaultMessage: 'Description' }),
      key: 'description',
      render(data, record) {
        return record?.products.map((re) => (
          <Tooltip key={record._id} title={re.description}>
            <span style={{ whiteSpace: 'nowrap', maxWidth: 150, textOverflow: 'ellipsis' }}>
              {re.description}
            </span>
          </Tooltip>
        ));
      }
    },
    {
      title: intl.formatMessage({ id: 'type', defaultMessage: 'Type' }),
      dataIndex: 'type',
      key: 'type',
      render(type: string) {
        switch (type) {
          case 'feed':
            return (
              <Tag color="blue">
                {intl.formatMessage({ id: 'post', defaultMessage: 'Post' })}
              </Tag>
            );
          case 'video':
            return (
              <Tag color="pink">
                {intl.formatMessage({ id: 'video', defaultMessage: 'Video' })}
              </Tag>
            );
          case 'product':
            return (
              <Tag color="orange">
                {intl.formatMessage({ id: 'product', defaultMessage: 'Product' })}
              </Tag>
            );
          case 'gallery':
            return (
              <Tag color="violet">
                {intl.formatMessage({ id: 'gallery', defaultMessage: 'Gallery' })}
              </Tag>
            );
          case 'message':
            return (
              <Tag color="red">
                {intl.formatMessage({ id: 'message', defaultMessage: 'Message' })}
              </Tag>
            );
          case 'tip':
            return (
              <Tag color="red">
                {intl.formatMessage({ id: 'creatorTip', defaultMessage: 'Creator Tip' })}
              </Tag>
            );
          case 'stream_tip':
            return (
              <Tag color="red">
                {intl.formatMessage({ id: 'streamingTip', defaultMessage: 'Streaming Tip' })}
              </Tag>
            );
          case 'public_chat':
            return (
              <Tag color="pink">
                {intl.formatMessage({ id: 'paidStreaming', defaultMessage: 'Paid Streaming' })}
              </Tag>
            );
          case 'monthly_subscription':
            return (
              <Tag color="green">
                {intl.formatMessage({ id: 'monthlySubscription', defaultMessage: 'Monthly Subscription' })}
              </Tag>
            );
          case 'quarterly_subscription':
            return (
              <Tag color="green">
                {intl.formatMessage({ id: 'quarterlySubscription', defaultMessage: 'Quarterly Subscription' })}
              </Tag>
            );
          case 'half_yearly_subscription':
            return (
              <Tag color="green">
                {intl.formatMessage({ id: 'halfYearlySubscription', defaultMessage: 'Half Yearly Subscription' })}
              </Tag>
            );
          case 'yearly_subscription':
            return (
              <Tag color="green">
                {intl.formatMessage({ id: 'yearlySubscription', defaultMessage: 'Yearly Subscription' })}
              </Tag>
            );
          case 'free_subscription':
            return (
              <Tag color="green">
                {intl.formatMessage({ id: 'freeSubscription', defaultMessage: 'Free Subscription' })}
              </Tag>
            );
          default:
            return <Tag color="default">{type}</Tag>;
        }
      }
    },
    {
      title: intl.formatMessage({ id: 'price', defaultMessage: 'Price' }),
      dataIndex: 'totalPrice',
      key: 'tokens',
      render(totalPrice) {
        return (
          <span style={{ whiteSpace: 'nowrap' }}>
            €
            {(totalPrice || 0).toFixed(2)}
          </span>
        );
      }
    },
    {
      title: intl.formatMessage({ id: 'status', defaultMessage: 'Status' }),
      dataIndex: 'status',
      key: 'status',
      render(status: string) {
        switch (status) {
          case 'pending':
            return (
              <Tag color="blue">
                {intl.formatMessage({ id: 'pending', defaultMessage: 'Pending' })}
              </Tag>
            );
          case 'success':
            return (
              <Tag color="green">
                {intl.formatMessage({ id: 'success', defaultMessage: 'Success' })}
              </Tag>
            );
          case 'refunded':
            return (
              <Tag color="red">
                {intl.formatMessage({ id: 'refunded', defaultMessage: 'Refunded' })}
              </Tag>
            );
          default:
            return <Tag color="default">{status}</Tag>;
        }
      }
    },
    {
      title: intl.formatMessage({ id: 'date', defaultMessage: 'Date' }),
      key: 'createdAt',
      dataIndex: 'createdAt',
      sorter: true,
      render(date: Date) {
        return <span>{formatDate(date)}</span>;
      }
    }
  ];
  return (
    <div className={`${styles.container} table-responsive`}>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{
          ...pagination,
          position: ['bottomCenter'],
          showSizeChanger: false,
          simple: isMobile
        }}
        rowKey={rowKey}
        loading={loading}
        onChange={onChange.bind(this)}
      />
    </div>
  );
}
export default PaymentTableList;
