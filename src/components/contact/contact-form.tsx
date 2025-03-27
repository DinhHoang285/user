'use client';

import { showError, showSuccess } from '@lib/message';
import { emailValidate, contactMessage, contactName } from '@lib/validation';
import { settingService } from '@services/setting.service';
import { Form, Input, Button } from 'antd';
import Link from 'next/link';
import { useState } from 'react';
import useCountdown from 'src/hooks/use-countdown';
import { useSession } from 'next-auth/react';
import { useIntl } from 'react-intl';
import style from './contact.module.scss';

export default function ContactForm() {
  const intl = useIntl();
  const { data: session } = useSession();
  const [submiting, setSubmiting] = useState(false);
  const numCountdown = 60;
  const { countTime, setCountdown } = useCountdown();

  return (
    <div className={style['contact-box']}>
      <Form
        layout="vertical"
        name="contact-form"
        onFinish={async (values) => {
          try {
            setSubmiting(true);
            await settingService.contact(values);
            showSuccess(
              intl.formatMessage({
                id: 'thankYouForContactUs',
                defaultMessage: 'Thank you for contact us, we will reply within 48hrs.'
              })
            );
            setCountdown(numCountdown);
          } catch (e) {
            showError(e);
          } finally {
            setSubmiting(false);
          }
        }}
        scrollToFirstError
        className="contact-form"
      >
        <Form.Item
          name="name"
          rules={contactName}
        >
          <Input placeholder={intl.formatMessage({ id: 'fullName', defaultMessage: 'Full name' })} />
        </Form.Item>
        <Form.Item
          name="email"
          rules={emailValidate}
        >
          <Input placeholder={intl.formatMessage({ id: 'emailAddress', defaultMessage: 'Email address' })} />
        </Form.Item>
        <Form.Item
          name="message"
          rules={contactMessage}
        >
          <Input.TextArea
            rows={4}
            placeholder={intl.formatMessage({ id: 'message', defaultMessage: 'Message' })}
            onClear={() => {}}
          />
        </Form.Item>
        <div className="text-center">
          <Button
            size="large"
            className="form-button"
            htmlType="submit"
            loading={submiting || countTime > 0}
            disabled={submiting || countTime > 0}
            style={{ fontWeight: 600, width: '100%' }}
          >
            <span>
              {countTime > 0
                ? intl.formatMessage({ id: 'resendIn', defaultMessage: 'RESEND IN' })
                : intl.formatMessage({ id: 'send', defaultMessage: 'SEND' })}
            </span>
            &nbsp;
            {countTime > 0 && `${countTime}s`}
          </Button>
        </div>
      </Form>
      <div className="text-center">
        {!session?.user?._id && (
          <p>
            <span>{intl.formatMessage({ id: 'haveAccountAlready', defaultMessage: 'Have an account already?' })}</span>
            &nbsp;
            <Link href="/">
              <span>{intl.formatMessage({ id: 'loginHere', defaultMessage: 'Log in here.' })}</span>
            </Link>
          </p>
        )}
        {(!session?.user?._id || !session?.user?.isPerformer) && (
          <p>
            <span>{intl.formatMessage({ id: 'areYouACreator', defaultMessage: 'Are you a creator?' })}</span>
            &nbsp;
            <Link href="/register">
              <span>{intl.formatMessage({ id: 'signUpHere', defaultMessage: 'Sign up here.' })}</span>
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
