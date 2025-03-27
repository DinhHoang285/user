'use client';

import { IUser } from '@interfaces/user';
import { showError, showSuccess } from '@lib/message';
import { performerService } from '@services/performer.service';
import { useIntl } from 'react-intl';
import {
  Button, Col, Form, Row, Switch
} from 'antd';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useMainThemeLayout } from 'src/providers/main-layout.provider';

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

export default function SecureForm() {
  const { settings } = useMainThemeLayout();
  const { data: session, update: updateUser } = useSession();
  const user: IUser = session?.user as IUser;
  const [updating, setUpdating] = useState(false);
  const intl = useIntl();

  const handleUpdatePerformer = async (payload) => {
    try {
      setUpdating(true);
      const updated = await performerService.updateMe(user?._id, payload);
      updateUser({ info: updated.data });
      showSuccess(intl.formatMessage({ id: 'changesSaved', defaultMessage: 'Changes saved' }));
    } catch (e) {
      showError(e);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Form
      {...layout}
      name="nest-messages"
      onFinish={(values) => handleUpdatePerformer(values)}
      initialValues={
        {
          enable2StepEmail: user?.enable2StepEmail && settings?.enable2StepEmail
        }
      }
      labelAlign="left"
      scrollToFirstError
    >
      <Row>
        <Col xl={12} md={12} xs={24}>
          <Form.Item
            label={intl.formatMessage({
              id: 'twoStepAuthEmailLable',
              defaultMessage: 'Enable 2 Step Authentication with Email'
            })}
            name="enable2StepEmail"
            valuePropName="checked"
            extra={intl.formatMessage({
              id: 'twoStepAuthEmailExtra',
              defaultMessage: 'If enabled, you need verify OTP code sent to your registered email'
            })}
            tooltip={
              !settings.enable2StepEmail
              && intl.formatMessage({
                id: 'adminHasDisabledThisFeature',
                defaultMessage: 'Admin has disabled this feature'
              })
            }
          >

            <Switch
              unCheckedChildren={intl.formatMessage({
                id: 'disable',
                defaultMessage: 'Disable'
              })}
              checkedChildren={intl.formatMessage({
                id: 'enable',
                defaultMessage: 'Enable'
              })}
              disabled={!settings.enable2StepEmail}
            />
          </Form.Item>
          <Button
            block
            className="primary"
            htmlType="submit"
            disabled={updating}
            loading={updating}
          >
            {intl.formatMessage({ id: 'saveChanges', defaultMessage: 'Save Changes' })}
          </Button>
        </Col>
      </Row>
    </Form>
  );
}
