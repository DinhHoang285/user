'use client';

/* eslint-disable indent */
/* eslint-disable no-nested-ternary */
import {
  Table, Tag, Tooltip
} from 'antd';
import Link from 'next/link';
import { isMobile } from 'react-device-detect';
import {
  AiFillPushpin,
  AiOutlineAudio, AiOutlineDelete, AiOutlineEdit,
  AiOutlinePicture,
  AiOutlinePushpin,
  AiOutlineShoppingCart,
  AiOutlineVideoCamera
} from 'react-icons/ai';
import { useIntl } from 'react-intl';
import { IFeed } from 'src/interfaces';
import { formatDate } from 'src/lib';
import styles from './table-list.module.scss';

interface IProps {
  feeds: IFeed[];
  searching: boolean;
  total: number;
  pageSize: number;
  onChange: Function;
  onDelete: Function;
  onEdit?: Function;
  onPin?: Function
}

export default function FeedList({
  feeds,
  searching,
  total,
  pageSize,
  onChange,
  onDelete,
  onEdit,
  onPin
}: IProps) {
  const intl = useIntl();
  const columns = [
    {
      title: intl.formatMessage({ id: 'type', defaultMessage: 'Type' }),
      key: 'id',
      render: (record) => (
        <Link
          href={`/post/${record?.slug || record?._id}`}
          className={styles['table-list-type']}
        >
          {(record?.type === 'text') && (
            <span>
              {intl.formatMessage({ id: 'Aa', defaultMessage: 'Aa' })}
            </span>
          )}
          {(record?.type === 'photo') && (
            <span>
              <AiOutlinePicture />
            </span>
          )}

          {(record?.type === 'video' || record?.type === 'reel') && (
            <span>
              <AiOutlineVideoCamera />
            </span>
          )}
          {(record?.type === 'audio') && (
            <span>
              <AiOutlineAudio />
            </span>
          )}
          {(record?.type === 'product') && (
            <span>
              <AiOutlineShoppingCart />
            </span>
          )}
        </Link>
      )
    },
    {
      title: 'Pinned',
      dataIndex: 'isPinned',
      render(isPinned: boolean) {
        if (!isPinned) {
          return <Tag color="red">N</Tag>;
        }
        return <Tag color="green">Y</Tag>;
      }
    },
    {
      title: intl.formatMessage({ id: 'thumbnail', defaultMessage: 'Thumbnail' }),
      key: 'files',
      width: '120px',
      render: (record: any) => {
        const thumb = record?.files[0]?.thumbnails?.[0] || '/no-image.jpg';
        if (record.type === 'text') {
          return (
            <div className={styles['table-list-noImage']}>
              <span>
                {intl.formatMessage({ id: 'Aa', defaultMessage: 'Aa' })}
              </span>
            </div>
          );
        }
        if (record?.type === 'audio') {
          return (
            <div className={styles['table-list-noImage']}>
              <div className={styles['table-list-thumb']}>
                <img src="/audio-paused.jpg" alt="thumb" />
              </div>
            </div>
          );
        }

        return (
          <div className={styles['table-list-thumb']}>
            {thumb && <img src={thumb} alt="thumb" />}
          </div>
        );
      }
    },
    {
      title: intl.formatMessage({ id: 'title', defaultMessage: 'Title' }),
      key: 'title',
      render: (row: any) => (
        <Tooltip title={row?.title || ''}>
          <div style={{
            width: 100, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', textTransform: 'capitalize'
          }}
          >
            {row?.title || intl.formatMessage({ id: 'thisFeedHasNotTitle', defaultMessage: 'this feed has not title' })}
          </div>
        </Tooltip>
      )
    },
    {
      title: intl.formatMessage({ id: 'description', defaultMessage: 'Description' }),
      key: 'text',
      render: (row: any) => (
        <Tooltip title={row?.text || ''}>
          <div style={{
            width: 150, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden'
          }}
          >
            {row?.text || intl.formatMessage({ id: 'thisFeedHasNotDescription', defaultMessage: 'this feed has not description' })}
          </div>
        </Tooltip>
      )
    },
    {
      title: intl.formatMessage({ id: 'status', defaultMessage: 'Status' }),
      key: 'status',
      render: (data: any) => {
        switch (data?.status) {
          case 'active':
            return (
              <Tag
                style={{
                  color: '#589F4C'
                }}
                color="#F5FFED"
              >
                {intl.formatMessage({ id: 'active', defaultMessage: 'Active' })}
              </Tag>
            );
          case 'inactive':
            return (
              <Tag
                style={{
                  color: '#FF0000'
                }}
                color="#E1AAA4"
              >
                {intl.formatMessage({ id: 'inactive', defaultMessage: 'Inactive' })}
              </Tag>
            );
          default: return <Tag color="blue">{data?.status}</Tag>;
        }
      }
    },
    {
      title: intl.formatMessage({ id: 'scheduled', defaultMessage: 'Scheduled' }),
      key: 'isSchedule',
      render: (data: any) => {
        switch (data?.isSchedule) {
          case true:
            return (
              <Tag
                style={{
                  color: '#589F4C'
                }}
                color="#F5FFED"
              >
                {intl.formatMessage({ id: 'yes', defaultMessage: 'Y' })}
              </Tag>
            );
          default: return (
            <Tag
              style={{
                color: '#FF0000'
              }}
              color="#E1AAA4"
            >
              {intl.formatMessage({ id: 'no', defaultMessage: 'N' })}
            </Tag>
          );
        }
      }
    },
    {
      title: intl.formatMessage({ id: 'sale', defaultMessage: 'Sale' }),
      key: 'isSale',
      render: (data: any) => {
        switch ((data?.isSale && !!data?.price)) {
          case true:
            return (
              <Tag
                style={{
                  color: '#589F4C'
                }}
                color="#F5FFED"
              >
                Y
              </Tag>
            );
          default: return (
            <Tag
              style={{
                color: '#FF0000'
              }}
              color="#E1AAA4"
            >
              N
            </Tag>
          );
        }
      }
    },
    {
      title: intl.formatMessage({ id: 'updatedOn', defaultMessage: 'Updated On' }),
      key: 'updatedAt',
      dataIndex: 'updatedAt',
      render: (updatedAt: Date) => <span>{formatDate(updatedAt)}</span>,
      sorter: true
    },
    {
      title: intl.formatMessage({ id: 'action', defaultMessage: 'Action' }),
      key: 'details',
      render: (record) => [
        <div className={styles['action-button']} key="action-button">
          <button
            type="button"
            style={{ marginRight: 5 }}
            className={record.isPinned ? 'danger' : 'primary'}
            onClick={(e) => {
              e.preventDefault();
              onPin(record);
            }}
          >
            {record.isPinned ? <AiFillPushpin /> : <AiOutlinePushpin />}
            {intl.formatMessage({ id: record.isPinned ? 'unpinFromProfile' : 'pinToProfile', defaultMessage: record.isPinned ? 'Unpin from Profile' : 'Pin to Profile' })}
          </button>

          <div className="info" key="edit">
            {!record?.idFree ? (
              // eslint-disable-next-line react/jsx-indent
              <button
                type="button"
                className="edit-item"
                onClick={() => {
                  onEdit(record);
                }}
                aria-label="Edit item"
              >
                <AiOutlineEdit />
              </button>
            ) : (
              record ? (
                <Link
                  key="edit"
                  className="edit-item"
                  href={`/my-post/edit/${record._id}`}
                >
                  <AiOutlineEdit />
                </Link>
              ) : (
                <span className="edit-item" style={{ opacity: 0.5, cursor: 'not-allowed' }}><AiOutlineEdit /></span>
              )
            )}
          </div>
          <button
            type="button"
            key="status"
            className="delete"
            onClick={() => {
              onDelete(record);
            }}
          >
            <AiOutlineDelete />
          </button>
        </div>
      ]
    }
  ];
  const dataSource = feeds.map((p) => ({ ...p, key: p._id }));

  return (
    <div className={styles.container}>
      <Table
        dataSource={dataSource}
        columns={columns}
        className="table"
        pagination={{
          total, pageSize, position: ['bottomCenter'], showSizeChanger: false, simple: isMobile
        }}
        rowKey="_id"
        showSorterTooltip={false}
        loading={searching}
        onChange={onChange.bind(this)}
      />
    </div>
  );
}
