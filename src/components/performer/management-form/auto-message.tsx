'use client';

import {
  Button, Col, Divider, Form, Input, Row, Switch
} from 'antd';
import { IPerformer } from 'src/interfaces';
import { performerService } from '@services/performer.service';
import { useSession } from 'next-auth/react';
import { showError, showSuccess, validateMessages } from '@lib/message';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import style from './auto-message.module.scss';

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

interface IProps {
  user: IPerformer;
}

export default function AutoMessageForm({ user }: IProps) {
  const { data: session, update: updateUser } = useSession();
  const [updating, setUpdating] = useState(false);
  const intl = useIntl();

  const updatePerformer = async (payload) => {
    const { _id } = payload;
    try {
      setUpdating(true);
      const updated = await performerService.updateMe(_id, payload);

      updateUser({
        info: {
          ...session?.user,
          defaultMessageFollow: updated?.data?.defaultMessageFollow,
          defaultMessageSubcribe: updated?.data?.defaultMessageSubcribe
        }
      });
      showSuccess(intl.formatMessage({ id: 'changesSaved', defaultMessage: 'Changes saved' }));
    } catch (e) {
      showError(e);
    } finally {
      setUpdating(false);
    }
  };

  const submit = (data: any) => {
    updatePerformer({
      ...user,
      ...data
    });
  };

  return (
    <Form
      {...layout}
      onFinish={(values) => submit(values)}
      validateMessages={validateMessages}
      initialValues={user}
      labelAlign="left"
      className={style['auto-message']}
      scrollToFirstError
    >
      <Row>
        <Col xl={12} md={12} xs={24}>
          <Form.Item name="enableMsgFollow" valuePropName="checked">
            <Switch
              unCheckedChildren={intl.formatMessage({
                id: 'disableMessageWhenFollow',
                defaultMessage: 'Disable auto send message when follow'
              })}
              checkedChildren={intl.formatMessage({
                id: 'enableMessageWhenFollow',
                defaultMessage: 'Enable auto send message when follow'
              })}
            />
          </Form.Item>
          <Form.Item
            labelCol={{ span: 24 }}
            name="defaultMessageFollow"
            label={intl.formatMessage({
              id: 'messageWhenFollow',
              defaultMessage: 'Message when follow'
            })}
            extra={intl.formatMessage({
              id: 'messageWhenFollowExtra',
              defaultMessage:
          'When a user follow you, a message is automatically sent to the user inbox'
            })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'pleaseInputMessage',
                  defaultMessage: 'Please input message!'
                })
              }
            ]}
          >
            <Input.TextArea rows={2} maxLength={100} showCount />
          </Form.Item>
          <Divider />
          <Form.Item name="enableMsgSubcribe" valuePropName="checked">
            <Switch
              unCheckedChildren={intl.formatMessage({
                id: 'disableMessageWhenSubscribe',
                defaultMessage: 'Disable auto send message when subscribe'
              })}
              checkedChildren={intl.formatMessage({
                id: 'enableMessageWhenSubscribe',
                defaultMessage: 'Enable auto send message when subscribe'
              })}
            />
          </Form.Item>
          <Form.Item
            labelCol={{ span: 24 }}
            name="defaultMessageSubcribe"
            label={intl.formatMessage({
              id: 'messageWhenSubcribe',
              defaultMessage: 'Message when subcribe'
            })}
            extra={intl.formatMessage({
              id: 'messageWhenSubcribeExtra',
              defaultMessage:
          'When a user subcribe you, a message is automatically sent to the user inbox'
            })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'pleaseInputMessage',
                  defaultMessage: 'Please input message!'
                })
              }
            ]}
          >
            <Input.TextArea rows={2} maxLength={100} showCount />
          </Form.Item>
          <Button
            block
            className="primary"
            htmlType="submit"
            disabled={updating}
            loading={updating}
          >
            {intl.formatMessage({
              id: 'saveChanges',
              defaultMessage: 'Save Changes'
            })}
          </Button>
        </Col>
      </Row>
    </Form>
  );
}
