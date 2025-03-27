/* eslint-disable @typescript-eslint/no-unused-vars */
import { requestService } from '@services/request.service';
import {
  Form, Input, Modal, Button
} from 'antd';
import { useIntl } from 'react-intl';
import { showError } from '@lib/message';
import style from './reason-delete.module.scss';

function ReasonDelete({
  setIsModalOpen, isModalOpen, reason, setReason, content
}: any) {
  const intl = useIntl();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const typeRequest = 'delete';
      if (
        !window.confirm(
          intl.formatMessage(
            { id: 'confirmDelete', defaultMessage: 'Are you sure you want to delete this {mediaType}?' },
            { mediaType: content.mediaType }
          )
        )
      ) return;
      const response = await requestService.createRequest({ sourceId: content._id, reason, typeRequest }, content.mediaType);
      setIsModalOpen(false);
      setReason('');
    } catch (error) {
      showError('error => ');
    }
  };

  const onFinish = async (values) => {
    const data = { ...values };
    data.sourceId = content._id;
    data.typeRequest = 'delete';
    try {
      if (
        !window.confirm(
          intl.formatMessage(
            { id: 'confirmDelete', defaultMessage: 'Are you sure you want to delete this {mediaType}?' },
            { mediaType: content.mediaType }
          )
        )
      ) return;
      const response = await requestService.createRequest({ ...data }, content.mediaType);
      setIsModalOpen(false);
    } catch (error) {
      showError('error => ');
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Modal
      title={intl.formatMessage({ id: 'reasonForDeletingPPV', defaultMessage: 'Reason for deleting PPV content' })}
      open={isModalOpen}
      onOk={handleOk}
      footer={false}
      onCancel={handleCancel}
    >
      <div className={style.container}>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{
            title: content?.title,
            description: content?.description
          }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <p className={style.boxReason}>
            <span>{intl.formatMessage({ id: 'reason', defaultMessage: 'Reason ?' })}</span>
          </p>
          <Form.Item
            name="reason"
            rules={[
              { required: true, message: intl.formatMessage({ id: 'enterYourReason', defaultMessage: 'Enter your reason' }) }
            ]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              <span>{intl.formatMessage({ id: 'submit', defaultMessage: 'Submit' })}</span>
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}

export default ReasonDelete;
