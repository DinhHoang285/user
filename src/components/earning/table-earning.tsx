/* eslint-disable default-case */
import { formatDate } from '@lib/date';
import { Table, Tag, Avatar } from 'antd';
import Link from 'next/link';
import { isMobile } from 'react-device-detect';
import { useIntl } from 'react-intl';
import { IEarning } from 'src/interfaces';

interface IProps {
  dataSource: IEarning[];
  rowKey: string;
  pagination: any;
  onChange: Function;
  loading: boolean;
}

export function TableListEarning(props: IProps) {
  const intl = useIntl();
  const {
    dataSource, rowKey, pagination, onChange, loading
  } = props;
  const columns = [
    {
      title: intl.formatMessage({ id: 'user', defaultMessage: 'User' }),
      dataIndex: 'userInfo',
      render(userInfo) {
        return (
          <Link
            href={{ pathname: '/messages', query: { toSource: 'user', toId: userInfo?._id } }}
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              color: '#09B3F2'
            }}
          >
            <Avatar src={userInfo?.avatar || '/no-avatar.jpg'} />
            &nbsp;
            {userInfo?.name || userInfo?.username || 'N/A'}
          </Link>
        );
      }
    },
    {
      title: intl.formatMessage({ id: 'type', defaultMessage: 'Type' }),
      dataIndex: 'type',
      render(type: string) {
        switch (type) {
          case 'monthly_subscription':
            return <Tag color="red">{intl.formatMessage({ id: 'monthlySubs', defaultMessage: 'Monthly subs' })}</Tag>;
          case 'yearly_subscription':
            return <Tag color="red">{intl.formatMessage({ id: 'yearlySubs', defaultMessage: 'Yearly subs' })}</Tag>;
          case 'public_chat':
            return <Tag color="violet">{intl.formatMessage({ id: 'paidStreaming', defaultMessage: 'Paid Streaming' })}</Tag>;
          case 'feed':
            return <Tag color="green">{intl.formatMessage({ id: 'post', defaultMessage: 'Post' })}</Tag>;
          case 'tip':
            return <Tag color="orange">{intl.formatMessage({ id: 'tip', defaultMessage: 'Tip' })}</Tag>;
          case 'message':
            return <Tag color="#0554A5">{intl.formatMessage({ id: 'message', defaultMessage: 'Message' })}</Tag>;
          case 'product':
            return <Tag color="blue">{intl.formatMessage({ id: 'product', defaultMessage: 'Product' })}</Tag>;
          case 'gallery':
            return <Tag color="success">{intl.formatMessage({ id: 'gallery', defaultMessage: 'Gallery' })}</Tag>;
          case 'stream_tip':
            return <Tag color="orange">{intl.formatMessage({ id: 'streamingTip', defaultMessage: 'Streaming tip' })}</Tag>;
        }
        return <Tag color="success">{type}</Tag>;
      }
    },
    {
      title: intl.formatMessage({ id: 'gross', defaultMessage: 'GROSS' }),
      dataIndex: 'grossPrice',
      render(grossPrice: number) {
        return (
          <span style={{ whiteSpace: 'nowrap' }}>
            €
            {grossPrice.toFixed(2)}
          </span>
        );
      }
    },
    {
      title: intl.formatMessage({ id: 'comission', defaultMessage: 'Commission' }),
      dataIndex: 'siteCommission',
      render(commission: number) {
        return (
          <span>
            {commission * 100}
            %
          </span>
        );
      }
    },
    {
      title: intl.formatMessage({ id: 'net', defaultMessage: 'NET' }),
      dataIndex: 'netPrice',
      render(netPrice: number) {
        return (
          <span style={{ whiteSpace: 'nowrap' }}>
            €
            {(netPrice || 0).toFixed(2)}
          </span>
        );
      }
    },
    {
      title: intl.formatMessage({ id: 'date', defaultMessage: 'Date' }),
      dataIndex: 'createdAt',
      sorter: true,
      render(createdAt: Date) {
        return <span>{formatDate(createdAt)}</span>;
      }
    }
  ];
  return (
    <div className="table-responsive">
      <Table
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        rowKey={rowKey}
        pagination={{
          ...pagination, position: ['bottomCenter'], showSizeChanger: false, simple: isMobile
        }}
        onChange={onChange.bind(this)}
      />
    </div>
  );
}
