import {
  AiOutlineDelete, AiOutlineDown, AiOutlineFire, AiOutlineMessage, AiOutlinePicture, AiOutlineVideoCamera
} from 'react-icons/ai';
import { IVault } from '@interfaces/vaut';
import { IVideo } from '@interfaces/video';
import {
  Button, Dropdown, Menu,
  Table
} from 'antd';
import Link from 'next/link';
import { useIntl } from 'react-intl';
import { formatDate } from 'src/lib';
import styles from './table-list-vault.module.scss';

interface IProps {
  vaults: IVault[];
  searching: boolean;
  total: number;
  pageSize: number;
  onChange: Function;
  onDelete: Function;
}

function TableListVault({
  vaults,
  searching,
  total,
  pageSize,
  onChange,
  onDelete
}: IProps) {
  const intl = useIntl();
  const columns = [
    {
      title: intl.formatMessage({ id: 'type', defaultMessage: 'Type' }),
      key: 'id',
      width: '8%',
      render: (record) => (
        <div className={styles['table-list-type']}>
          {record.type === 'video' ? (
            <span>
              <AiOutlineVideoCamera />
            </span>
          ) : (
            <span>
              <AiOutlinePicture />
            </span>
          )}
        </div>
      )
    },
    {
      title: intl.formatMessage({ id: 'thumbnail', defaultMessage: 'Thumbnail' }),
      width: '12%',
      render: (record: IVault) => {
        const thumb = (record?.thumbnails && record?.thumbnails[0]) || '/no-image.jpg';
        return (
          <div className={styles['table-list-thumb']}>
            {thumb && <img src={thumb} alt="thumb" />}
          </div>
        );
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
      title: intl.formatMessage({ id: 'sendTo', defaultMessage: 'Send to' }),
      dataIndex: '_id',
      render(data, record) {
        return (
          <Dropdown
            overlay={(
              <Menu>
                <Menu.Item key="feed">
                  <Link
                    href={{
                      pathname: '/creator/my-post/create',
                      query: { type: record?.type, vaultId: record?._id }
                    }}
                  >
                    <p>
                      <span><AiOutlineFire /></span>
                      {' '}
                      <span>{intl.formatMessage({ id: 'feed', defaultMessage: 'Feed' })}</span>
                    </p>
                  </Link>
                </Menu.Item>
                <Menu.Item key="messages">
                  <Link
                    href={{
                      pathname: '/messages',
                      query: { type: record?.type, vaultId: record?._id }
                    }}
                  >
                    <p>
                      <span><AiOutlineMessage /></span>
                      {' '}
                      <span>{intl.formatMessage({ id: 'message', defaultMessage: 'Message' })}</span>
                    </p>
                  </Link>
                </Menu.Item>
              </Menu>
            )}
          >
            <Button className="secondary">
              <span>{intl.formatMessage({ id: 'action', defaultMessage: 'Action' })}</span>
              {' '}
              <span><AiOutlineDown /></span>
            </Button>
          </Dropdown>
        );
      }
    },
    {
      title: intl.formatMessage({ id: 'action', defaultMessage: 'Action' }),
      render: (record: IVideo) => (
        <Button
          key="status"
          className="danger"
          onClick={() => onDelete(record._id)}
        >
          <span><AiOutlineDelete /></span>
        </Button>
      )
    }
  ];

  return (
    <Table
      dataSource={vaults}
      columns={columns}
      className={styles['container-table']}
      pagination={{
        total,
        pageSize
      }}
      rowKey="_id"
      showSorterTooltip={false}
      loading={searching}
      onChange={onChange.bind(this)}
    />
  );
}
TableListVault.defaultProps = {};
export default TableListVault;
