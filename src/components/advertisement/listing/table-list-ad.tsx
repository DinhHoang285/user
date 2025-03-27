import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { formatDate } from '@lib/date';
import {
  Button, Table, Tag, Tooltip
} from 'antd';
import Link from 'next/link';
import { isMobile } from 'react-device-detect';
import { useIntl } from 'react-intl';
import { ThumbnailAds } from './thumbnail-ads';

interface IProps {
  dataSource: [];
  rowKey: string;
  loading: boolean;
  pagination: {};
  onChange: Function;
  onDelete: Function;
}

export function TableListAd(props: IProps) {
  const {
    dataSource,
    rowKey,
    loading,
    pagination,
    onChange,
    onDelete
  } = props;

  const intl = useIntl();

  const columns = [
    {
      title: intl.formatMessage({ id: 'thumbnail', defaultMessage: 'Thumbnail' }),
      render(record: any) {
        return (
          <Link href={`/video/${record.slug || record._id}?isAd=true`}>
            <ThumbnailAds video={record} />
          </Link>
        );
      }
    },
    {
      title: intl.formatMessage({ id: 'title', defaultMessage: 'Title' }),
      dataIndex: 'title',
      render(title: string, record: any) {
        return (
          <Tooltip title={title}>
            <div style={{
              maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
            }}
            >
              <Link href={`/video/${record.slug || record._id}?isAd=true`}>
                <span>{title}</span>
              </Link>
            </div>
          </Tooltip>
        );
      }
    },
    {
      title: intl.formatMessage({ id: 'ordering', defaultMessage: 'Ordering' }),
      dataIndex: 'ordering',
      render(ordering: any) {
        switch (true) {
          case ordering > 7:
            return <Tag color="green"><span>{ordering}</span></Tag>;
          case ordering > 3 && ordering < 5:
            return <Tag color="red"><span>{ordering}</span></Tag>;
          default:
            return <Tag color="orange"><span>{ordering}</span></Tag>;
        }
      }
    },
    {
      title: intl.formatMessage({ id: 'schedule', defaultMessage: 'Schedule?' }),
      dataIndex: 'isSchedule',
      render(isSchedule: boolean) {
        return isSchedule
          ? <Tag color="green"><span>{intl.formatMessage({ id: 'yes', defaultMessage: 'Y' })}</span></Tag>
          : <Tag color="red"><span>{intl.formatMessage({ id: 'no', defaultMessage: 'N' })}</span></Tag>;
      }
    },
    {
      title: intl.formatMessage({ id: 'status', defaultMessage: 'Status' }),
      dataIndex: 'status',
      render(status: string) {
        switch (status) {
          case 'active':
            return <Tag color="success"><span>{intl.formatMessage({ id: 'active', defaultMessage: 'Active' })}</span></Tag>;
          case 'inactive':
            return <Tag color="orange"><span>{intl.formatMessage({ id: 'inactive', defaultMessage: 'Inactive' })}</span></Tag>;
          default:
            return <Tag color="red"><span>{status}</span></Tag>;
        }
      }
    },
    {
      title: intl.formatMessage({ id: 'updatedOn', defaultMessage: 'Updated On' }),
      dataIndex: 'updatedAt',
      sorter: true,
      render(date: Date) {
        return <span>{formatDate(date)}</span>;
      }
    },
    {
      title: intl.formatMessage({ id: 'action', defaultMessage: 'Action' }),
      dataIndex: '_id',
      render: (id: string) => (
        <div style={{ whiteSpace: 'nowrap' }}>
          <Button className="info">
            <Link href={`/creator/my-advertisement/update/${id}`}>
              <span><AiOutlineEdit /></span>
            </Link>
          </Button>
          <Button onClick={() => onDelete(id)} className="danger">
            <span><AiOutlineDelete /></span>
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="table-responsive">
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={rowKey}
        loading={loading}
        pagination={{
          ...pagination,
          position: ['bottomCenter'],
          showSizeChanger: false,
          simple: isMobile
        }}
        onChange={onChange.bind(this)}
      />
    </div>
  );
}

export default TableListAd;
