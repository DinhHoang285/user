'use client';

import { Pagination } from 'antd';

export default function PerformerListPagination({
  current, limit, total, handlePaginationChange
}: { current: number, limit: number, total: number, handlePaginationChange: Function }) {
  return (
    <Pagination
      current={current}
      total={total || 0}
      pageSize={limit}
      onChange={(page, pageSize) => handlePaginationChange(page, pageSize)}
      showSizeChanger={false}
      showQuickJumper={false}
    />
  );
}
