/* eslint-disable prefer-promise-reject-errors */

'use client';

import { confirmPassword, password } from '@lib/validation';
import {
  Button, Col, Form, Input, Row
} from 'antd';
import React from 'react';
import { useIntl } from 'react-intl';

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

interface IProps {
  onFinish: Function;
  updating: boolean;
}

export function UpdatePasswordForm({ onFinish, updating = false }: IProps) {
  const intl = useIntl();

  return (
    <Form name="nest-messages" className="account-form" onFinish={onFinish.bind(this)} {...layout}>
      <Row>
        <Col md={12} xs={24}>
          <Form.Item
            label={intl.formatMessage({ id: 'password', defaultMessage: 'Password' })}
            name="password"
            rules={password}
          >
            <Input.Password placeholder={intl.formatMessage({ id: 'passwordPlaceholder', defaultMessage: 'Password' })} />
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item
            label={intl.formatMessage({ id: 'confirmPassword', defaultMessage: 'Confirm Password' })}
            name="confirm"
            validateTrigger={['onChange', 'onBlur']}
            dependencies={['password']}
            rules={confirmPassword}
          >
            <Input.Password placeholder={intl.formatMessage({ id: 'confirmPasswordPlaceholder', defaultMessage: 'Confirm password' })} />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item wrapperCol={{ offset: 4 }}>
        <Button className="primary" htmlType="submit" loading={updating}>
          {intl.formatMessage({ id: 'savePassword', defaultMessage: 'Save Password' })}
        </Button>
      </Form.Item>
    </Form>
  );
}
