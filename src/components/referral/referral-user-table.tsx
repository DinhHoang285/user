'use client';

import { IReferral } from '@interfaces/referral';
import { formatDate } from '@lib/date';
import { Table, Tag } from 'antd';
import { useIntl } from 'react-intl';

interface IProps {
  dataSource: IReferral[];
  loading: boolean;
  rowKey: string;
  onChange: Function;
  pagination: { total, pageSize}
}

function TableListReferralUser({
  dataSource, loading, rowKey, onChange, pagination
}: IProps) {
  const intl = useIntl();
  const columns = [
    {
      title: 'Name',
      render(data, record) {
        return (
          <span>{record.registerInfo?.name}</span>
        );
      }
    },
    {
      title: 'Role',
      render(data, record) {
        switch (record?.registerSource) {
          case 'performer':
            return (
              <Tag color="cyan">
                {intl.formatMessage({ id: 'creator', defaultMessage: 'Creator' })}
              </Tag>
            );
          case 'user':
            return (
              <Tag color="geekblue">
                {intl.formatMessage({ id: 'fan', defaultMessage: 'Fan' })}
              </Tag>
            );
          default: return <Tag color="default">{record?.registerSource}</Tag>;
        }
      }
    },
    {
      title: 'Updated On',
      dataIndex: 'createdAt',
      sorter: true,
      render(date: Date) {
        return <span>{formatDate(date)}</span>;
      }
    }
  ];
  return (
    <div className="table-responsive">
      <Table
        rowKey={rowKey}
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        onChange={onChange.bind(this)}
        pagination={pagination.total <= pagination.pageSize ? false : pagination}
      />
    </div>
  );
}

export default TableListReferralUser;
