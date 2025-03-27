'use client';

import { Modal } from 'antd';
import { useIntl } from 'react-intl';

interface IProps {
  isDeleted: boolean;
  onClick: Function
}
function RecordModalDeleted({ isDeleted, onClick }: IProps) {
  const intl = useIntl();
  return (
    <Modal title="Discard Clip" centered open={isDeleted} okType="danger" okText="Discard" onOk={() => onClick(true)} onCancel={() => onClick()}>
      <p>
        {intl.formatMessage({ id: 'youCanNotRecoverADiscardedClip', defaultMessage: 'You can not recover a discarded clip' })}
      </p>
    </Modal>
  );
}

export default RecordModalDeleted;
