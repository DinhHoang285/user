import { formatDate, nowIsBefore } from '@lib/date';
import {
  Avatar, Button, Table, Tag
} from 'antd';
import Link from 'next/link';
import { isMobile } from 'react-device-detect';
import { useIntl } from 'react-intl';
import { ISubscription } from 'src/interfaces';

interface IProps {
  dataSource: ISubscription[];
  pagination: any;
  rowKey: string;
  onChange: any;
  loading: boolean;
  cancelSubscription: Function;
  activeSubscription: Function;
}

export function UserTableListSubscription({
  dataSource,
  pagination,
  rowKey,
  onChange,
  loading,
  cancelSubscription,
  activeSubscription
}: IProps) {
  const intl = useIntl();

  const columns = [
    {
      title: intl.formatMessage({
        id: 'creator',
        defaultMessage: 'Creator'
      }),
      dataIndex: 'performerInfo',
      render(data, records: ISubscription) {
        return (
          <Link
            href={`/${records?.performerInfo?.username || records?.performerInfo?._id}`}
          >
            <Avatar src={records?.performerInfo?.avatar || '/no-avatar.jpg'} />
            {' '}
            {records?.performerInfo?.name || records?.performerInfo?.username || 'N/A'}
          </Link>
        );
      }
    },
    {
      title: intl.formatMessage({
        id: 'type',
        defaultMessage: 'Type'
      }),
      dataIndex: 'subscriptionType',
      render(subscriptionType: string) {
        switch (subscriptionType) {
          case 'monthly':
            return (
              <Tag color="blue">
                {intl.formatMessage({
                  id: 'monthly',
                  defaultMessage: 'Monthly'
                })}
              </Tag>
            );
          case 'yearly':
            return (
              <Tag color="red">
                {intl.formatMessage({
                  id: 'yearly',
                  defaultMessage: 'Yearly'
                })}
              </Tag>
            );
          case 'free':
            return (
              <Tag color="orange">
                {intl.formatMessage({
                  id: 'free',
                  defaultMessage: 'Free'
                })}
              </Tag>
            );
          case 'system':
            return (
              <Tag color="default">
                {intl.formatMessage({
                  id: 'system',
                  defaultMessage: 'System'
                })}
              </Tag>
            );
          default:
            return <Tag color="orange">{subscriptionType}</Tag>;
        }
      }
    },
    {
      title: intl.formatMessage({
        id: 'startDate',
        defaultMessage: 'Start Date'
      }),
      dataIndex: 'createdAt',
      sorter: true,
      render(date: Date) {
        return <span>{formatDate(date, 'll')}</span>;
      }
    },
    {
      title: intl.formatMessage({
        id: 'expiryDate',
        defaultMessage: 'Expiry Date'
      }),
      dataIndex: 'expiredAt',
      sorter: true,
      render(date: Date, record: ISubscription) {
        return <span>{record.status !== 'active' || !nowIsBefore(record.expiredAt) ? formatDate(date, 'll') : ''}</span>;
      }
    },
    {
      title: intl.formatMessage({
        id: 'renewalDate',
        defaultMessage: 'Renewal Date'
      }),
      dataIndex: 'nextRecurringDate',
      sorter: true,
      render(date: Date, record: ISubscription) {
        return <span>{record.status === 'active' && record.subscriptionId && record.subscriptionType !== 'free' && formatDate(date, 'll')}</span>;
      }
    },
    {
      title: intl.formatMessage({
        id: 'updatedOn',
        defaultMessage: 'Update On'
      }),
      dataIndex: 'updatedAt',
      sorter: true,
      render(date: Date) {
        return <span>{formatDate(date)}</span>;
      }
    },
    {
      title: intl.formatMessage({
        id: 'pmGateway',
        defaultMessage: 'PM Gateway'
      }),
      dataIndex: 'paymentGateway',
      render: (paymentGateway: string) => <Tag color="default">{paymentGateway}</Tag>
    },
    {
      title: intl.formatMessage({
        id: 'status',
        defaultMessage: 'Status'
      }),
      dataIndex: 'status',
      render(status: string, record: ISubscription) {
        if (record.status === 'active' && !nowIsBefore(record.expiredAt)) {
          return (
            <Tag color="red">
              {intl.formatMessage({
                id: 'suspended',
                defaultMessage: 'Suspended'
              })}
            </Tag>
          );
        }
        switch (status) {
          case 'active':
            return (
              <Tag color="success">
                {intl.formatMessage({
                  id: 'active',
                  defaultMessage: 'Active'
                })}
              </Tag>
            );
          case 'deactivated':
            return (
              <Tag color="red">
                {intl.formatMessage({
                  id: 'inactive',
                  defaultMessage: 'Inactive'
                })}
              </Tag>
            );
          default:
            return <Tag color="default">{status}</Tag>;
        }
      }
    },
    {
      title: intl.formatMessage({
        id: 'action',
        defaultMessage: 'Action'
      }),
      dataIndex: '_id',
      render(_id, record: ISubscription) {
        return (
          <>
            {record.status === 'active' && nowIsBefore(record.expiredAt) && (
              <Button
                type="primary"
                danger
                onClick={() => cancelSubscription(record)}
              >
                {intl.formatMessage({
                  id: 'cancel',
                  defaultMessage: 'Cancel'
                })}
              </Button>
            )}
            {!nowIsBefore(record.expiredAt) && (
              <Button
                className="primary"
                onClick={() => activeSubscription(record)}
              >
                {intl.formatMessage({
                  id: 'activate',
                  defaultMessage: 'Activate'
                })}
              </Button>
            )}
          </>
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
        onChange={onChange}
        loading={loading}
      />
    </div>
  );
}
