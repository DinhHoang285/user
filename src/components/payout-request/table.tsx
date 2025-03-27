/* eslint-disable react/destructuring-assignment */
import { Table, Tag } from 'antd';
import Link from 'next/link';
import { isMobile } from 'react-device-detect';
import { useIntl } from 'react-intl';
import { PayoutRequestInterface } from 'src/interfaces';
import { formatDate } from 'src/lib';

interface IProps {
  payouts: PayoutRequestInterface[];
  searching: boolean;
  total: number;
  pageSize: number;
  onChange: Function;
}

function PayoutRequestList({
  payouts,
  searching,
  total,
  pageSize,
  onChange
}: IProps) {
  const intl = useIntl();
  const columns = [
    {
      title: intl.formatMessage({ id: 'id', defaultMessage: 'ID' }),
      dataIndex: '_id',
      key: 'id',
      render: (id: string, record) => (
        <Link
          href={`/payout-request/update?id=${record._id}`}
        >
          {id.slice(16, 24).toUpperCase()}
        </Link>
      )
    },
    {
      title: intl.formatMessage({ id: 'amount', defaultMessage: 'Amount' }),
      dataIndex: 'requestTokens',
      key: 'requestTokens',
      render: (requestTokens: number) => (
        <span>
          €
          {(requestTokens || 0).toFixed(2)}
        </span>
      )
    },
    {
      title: intl.formatMessage({ id: 'payoutGateway', defaultMessage: 'Payout Gateway' }),
      dataIndex: 'paymentAccountType',
      key: 'paymentAccountType',
      render: (paymentAccountType: string) => {
        switch (paymentAccountType) {
          case 'banking':
            return <Tag color="gold">{intl.formatMessage({ id: 'banking', defaultMessage: 'Banking' })}</Tag>;
          case 'paypal':
            return <Tag color="#25397c">{intl.formatMessage({ id: 'paypal', defaultMessage: 'Paypal' })}</Tag>;
          default:
            break;
        }
        return <Tag color="gold">{paymentAccountType}</Tag>;
      }
    },
    {
      title: `${intl.formatMessage({ id: 'status', defaultMessage: 'Status' })}`,
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        switch (status) {
          case 'done':
            return <Tag color="green" style={{ textTransform: 'capitalize' }}>{intl.formatMessage({ id: 'done', defaultMessage: 'Done' })}</Tag>;
          case 'pending':
            return <Tag color="orange" style={{ textTransform: 'capitalize' }}>{intl.formatMessage({ id: 'pending', defaultMessage: 'Pending' })}</Tag>;
          case 'rejected':
            return <Tag color="red" style={{ textTransform: 'capitalize' }}>{intl.formatMessage({ id: 'rejected', defaultMessage: 'Rejected' })}</Tag>;
          default: break;
        }
        return <Tag color="blue" style={{ textTransform: 'capitalize' }}>{status}</Tag>;
      }
    },
    {
      title: intl.formatMessage({ id: 'requestedOn', defaultMessage: 'Requested On' }),
      key: 'createdAt',
      dataIndex: 'createdAt',
      render: (createdAt: Date) => <span>{formatDate(createdAt)}</span>,
      sorter: true
    },
    {
      title: intl.formatMessage({ id: 'updatedOn', defaultMessage: 'Updated on' }),
      key: 'updatedAt',
      dataIndex: 'updatedAt',
      render: (updatedAt: Date) => <span>{formatDate(updatedAt)}</span>,
      sorter: true
    },
    {
      title: intl.formatMessage({ id: 'action', defaultMessage: 'Action' }),
      key: 'details',
      render: (request: PayoutRequestInterface) => (
        <Link href={`/payout-request/update/${request?._id}`}>
          {request.status === 'pending' ? intl.formatMessage({ id: 'update', defaultMessage: 'Update' }) : intl.formatMessage({ id: 'viewDetails', defaultMessage: 'View details' })}
        </Link>
      )
    }
  ];
  const dataSource = payouts.map((p) => ({ ...p, key: p._id }));

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      className="table"
      pagination={{
        total,
        pageSize,
        position: ['bottomCenter'],
        showSizeChanger: false,
        simple: isMobile
      }}
      loading={searching}
      onChange={onChange.bind(this)}
    />
  );
}
export default PayoutRequestList;
