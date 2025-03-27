'use client';

import { formatDate, nowIsBefore } from '@lib/date';
import { Avatar, Table, Tag } from 'antd';
import Link from 'next/link';
import { AiOutlineMessage } from 'react-icons/ai';
import { useMedia } from 'react-use-media';
import { ISubscription } from 'src/interfaces';
import { useIntl } from 'react-intl';

interface IProps {
  dataSource: ISubscription[];
  pagination: any;
  rowKey: string;
  onChange: Function;
  loading: boolean;
}

export function PerformerTableListSubscription({
  dataSource,
  pagination,
  rowKey,
  onChange,
  loading
}: IProps) {
  const intl = useIntl();
  const isMobile = useMedia({ maxWidth: 550 });

  const columns = [
    {
      title: intl.formatMessage({ id: 'user', defaultMessage: 'User' }),
      dataIndex: 'userInfo',
      render(data, record) {
        return (
          <Link
            href={{
              pathname: '/messages',
              query: { toId: record?.userInfo?._id, toSource: 'user' }
            }}
          >
            <Avatar src={record?.userInfo?.avatar || '/no-avatar.jpg'} />
            {' '}
            <span>
              {record?.userInfo?.name || record?.userInfo?.username || intl.formatMessage({ id: 'nA', defaultMessage: 'N/A' })}
            </span>
          </Link>
        );
      }
    },
    {
      title: intl.formatMessage({ id: 'type', defaultMessage: 'Type' }),
      dataIndex: 'subscriptionType',
      render(subscriptionType: string) {
        switch (subscriptionType) {
          case 'monthly':
            return <Tag color="blue"><span>{intl.formatMessage({ id: 'monthly', defaultMessage: 'Monthly' })}</span></Tag>;
          case 'yearly':
            return <Tag color="red"><span>{intl.formatMessage({ id: 'yearly', defaultMessage: 'Yearly' })}</span></Tag>;
          case 'free':
            return <Tag color="orange"><span>{intl.formatMessage({ id: 'free', defaultMessage: 'Free' })}</span></Tag>;
          case 'system':
            return <Tag color="default"><span>{intl.formatMessage({ id: 'system', defaultMessage: 'System' })}</span></Tag>;
          default:
            return <Tag color="orange"><span>{subscriptionType}</span></Tag>;
        }
      }
    },
    {
      title: intl.formatMessage({ id: 'startDate', defaultMessage: 'Start Date' }),
      dataIndex: 'createdAt',
      render(date: Date) {
        return <span>{formatDate(date, 'll')}</span>;
      }
    },
    {
      title: intl.formatMessage({ id: 'expiryDate', defaultMessage: 'Expiry Date' }),
      dataIndex: 'expiredAt',
      render(date: Date, record: ISubscription) {
        return (
          <span>
            {record.status !== 'active' || !nowIsBefore(record.expiredAt)
              ? formatDate(date, 'll')
              : ''}
          </span>
        );
      }
    },
    {
      title: intl.formatMessage({ id: 'renewalDate', defaultMessage: 'Renewal Date' }),
      dataIndex: 'nextRecurringDate',
      render(date: Date, record: ISubscription) {
        return (
          <span>
            {record.status === 'active' && record.subscriptionType !== 'free'
              ? formatDate(date, 'll')
              : ''}
          </span>
        );
      }
    },
    {
      title: intl.formatMessage({ id: 'pmGateway', defaultMessage: 'PM Gateway' }),
      dataIndex: 'paymentGateway',
      render(paymentGateway: string) {
        switch (paymentGateway) {
          case 'paypal':
            return <Tag color="violet"><span>{intl.formatMessage({ id: 'paypal', defaultMessage: 'Paypal' })}</span></Tag>;
          default:
            return <Tag color="cyan"><span>{paymentGateway}</span></Tag>;
        }
      }
    },
    {
      title: intl.formatMessage({ id: 'updatedOn', defaultMessage: 'Updated on' }),
      dataIndex: 'updatedAt',
      sorter: true,
      render(date: Date) {
        return <span>{formatDate(date)}</span>;
      }
    },
    {
      title: intl.formatMessage({ id: 'status', defaultMessage: 'Status' }),
      dataIndex: 'status',
      render(status: string, record: ISubscription) {
        if (record.status === 'active' && !nowIsBefore(record.expiredAt)) {
          return <Tag color="red"><span>{intl.formatMessage({ id: 'suspended', defaultMessage: 'Suspended' })}</span></Tag>;
        }
        switch (status) {
          case 'active':
            return <Tag color="#00c12c"><span>{intl.formatMessage({ id: 'active', defaultMessage: 'Active' })}</span></Tag>;
          case 'deactivated':
            return <Tag color="#FFCF00"><span>{intl.formatMessage({ id: 'inactive', defaultMessage: 'Inactive' })}</span></Tag>;
          default:
            return <Tag color="pink"><span>{status}</span></Tag>;
        }
      }
    },
    {
      title: intl.formatMessage({ id: 'message', defaultMessage: 'Message' }),
      render(record: ISubscription) {
        return (
          <Link
            href={{
              pathname: '/messages',
              query: { toId: record?.userInfo?._id, toSource: 'user' }
            }}
          >
            <span>
              <AiOutlineMessage style={{ fontSize: '25px' }} />
            </span>
          </Link>
        );
      }
    }
  ];

  return (
    <div className="table-responsive">
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey={rowKey}
        pagination={{
          ...pagination,
          position: ['bottomCenter'],
          showSizeChanger: false,
          simple: isMobile
        }}
        onChange={onChange.bind(this)}
        loading={loading}
      />
    </div>
  );
}

export default PerformerTableListSubscription;
