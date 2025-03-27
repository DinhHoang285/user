import { validateMessages } from '@lib/message';
import {
  Col,
  Form, Input, Row
} from 'antd';
import { useIntl } from 'react-intl';
import { IPerformer } from 'src/interfaces';

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

interface IProps {
  onFinish: Function;
  user: IPerformer;
  updating: boolean;
}

export function PerformerPaypalForm({ onFinish, user, updating }: IProps) {
  const intl = useIntl();
  const initialValues = { ...user.paypalSetting, ...(user.paypalSetting as any)?.value };
  return (
    <Form
      {...layout}
      name="nest-messages"
      onFinish={(val) => onFinish(val)}
      validateMessages={validateMessages}
      initialValues={initialValues || {
        email: '',
        phoneNumber: ''
      }}
      labelAlign="left"
    >
      <Row>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Form.Item
            name="email"
            label={intl.formatMessage({ id: 'paypalAccountEmail', defaultMessage: 'Paypal account email' })}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item className="text-center">
            <button
              className="primary-btn"
              type="submit"
              disabled={updating}
            >
              {intl.formatMessage({ id: 'saveChanges', defaultMessage: 'Save Changes' })}
            </button>
          </Form.Item>
        </Col>

      </Row>
    </Form>
  );
}

export default PerformerPaypalForm;
