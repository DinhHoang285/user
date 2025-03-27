import { AiOutlineEye } from 'react-icons/ai';
import { formatDate } from '@lib/date';
import { Table, Tag, Tooltip } from 'antd';
import Link from 'next/link';
import { isMobile } from 'react-device-detect';
import { IOrder, IUser } from 'src/interfaces';
import { useIntl } from 'react-intl';
import styles from './table-list.module.scss';

interface IProps {
  dataSource: IOrder[];
  pagination: {};
  rowKey: string;
  loading: boolean;
  onChange: Function;
  user: IUser;
}

function OrderTableList({
  dataSource,
  pagination,
  rowKey,
  loading,
  onChange,
  user
}: IProps) {
  const intl = useIntl();
  const columns = [
    {
      title: 'ID',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      render(orderNumber, record: IOrder) {
        return (
          <Link
            href={user.isPerformer ? `/my-order/${record._id}` : `/user/orders/${record._id}`}
          >
            {orderNumber || 'N/A'}
          </Link>
        );
      }
    },
    {
      title: intl.formatMessage({ id: 'product', defaultMessage: 'Product' }),
      dataIndex: 'productInfo',
      key: 'productInfo',
      render(product) {
        return (
          <Tooltip title={product?.title || 'N/A'}>
            <div style={{
              maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
            }}
            >
              <Link href={`/post/${product?.slug || product?._id}`}>
                {product?.title || 'N/A'}
              </Link>
            </div>
          </Tooltip>
        );
      }
    },
    {
      title: intl.formatMessage({ id: 'price', defaultMessage: 'Price' }),
      dataIndex: 'totalPrice',
      render(totalPrice) {
        return (
          <span>
            €
            {(totalPrice || 0).toFixed(2)}
          </span>
        );
      }
    },
    {
      title: intl.formatMessage({ id: 'deliveryStatus', defaultMessage: 'Delivery status' }),
      dataIndex: 'deliveryStatus',
      render(status: string) {
        switch (status) {
          case 'created':
            return <Tag color="gray">{intl.formatMessage({ id: 'created', defaultMessage: 'Created' })}</Tag>;
          case 'processing':
            return (
              <Tag color="#FFCF00">
                {intl.formatMessage({ id: 'processing', defaultMessage: 'Processing' })}
                {' '}
              </Tag>
            );
          case 'shipping':
            return <Tag color="#00dcff">{intl.formatMessage({ id: 'shipping', defaultMessage: 'Shipping' })}</Tag>;
          case 'delivered':
            return <Tag color="#00c12c">{intl.formatMessage({ id: 'delivered', defaultMessage: 'Delivered' })}</Tag>;
          case 'refunded':
            return <Tag color="red">{intl.formatMessage({ id: 'refunded', defaultMessage: 'Refunded' })}</Tag>;
          default: return <Tag color="#FFCF00">{status}</Tag>;
        }
      }
    },
    {
      title: intl.formatMessage({ id: 'updatedOn', defaultMessage: 'Updated On' }),
      dataIndex: 'createdAt',
      sorter: true,
      render(date: Date) {
        return <span>{formatDate(date)}</span>;
      }
    },
    {
      title: intl.formatMessage({ id: 'action', defaultMessage: 'Action' }),
      render(record: IOrder) {
        return (
          <Link
            href={user.isPerformer ? `/my-order/${record._id}` : `/user/orders/${record._id}`}
          >
            <AiOutlineEye />
            {' '}
            {intl.formatMessage({ id: 'view', defaultMessage: 'view' })}
          </Link>
        );
      }
    }
  ];
  return (
    <div className={styles['table-responsive']}>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{
          ...pagination, position: ['bottomCenter'], showSizeChanger: false, simple: isMobile
        }}
        rowKey={rowKey}
        loading={loading}
        onChange={onChange.bind(this)}
      />
    </div>
  );
}

export default OrderTableList;
