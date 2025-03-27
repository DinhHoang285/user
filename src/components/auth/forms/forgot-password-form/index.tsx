'use client';

import { showError, showSuccess } from '@lib/message';
import { emailValidate } from '@lib/validation';
import { authService } from '@services/index';
import { Form, Input } from 'antd';
import Link from 'next/link';
import { useState } from 'react';
import useCountdown from 'src/hooks/use-countdown';
import { IForgot } from 'src/interfaces';
import { useIntl } from 'react-intl';
import style from './forgot-password-form.module.scss';

export default function ForgotPasswordForm() {
  const intl = useIntl();
  const [submiting, setsubmiting] = useState(false);
  const numCountdown = 60;
  const { countTime, setCountdown } = useCountdown();

  return (
    <div className={style['forgot-box']}>
      <Form
        onFinish={async (data: IForgot) => {
          try {
            setsubmiting(true);
            await authService.resetPassword(data);
            showSuccess(
              intl.formatMessage({
                id: 'AnEmailHasBeenSent',
                defaultMessage: 'An email has been sent to you to reset your password'
              })
            );
            setCountdown(numCountdown);
          } catch (e) {
            showError(e);
          } finally {
            setsubmiting(false);
          }
        }}
      >
        <Form.Item
          name="email"
          validateTrigger={['onChange', 'onBlur']}
          rules={emailValidate}
        >
          <Input
            className={style.input}
            placeholder={intl.formatMessage({
              id: 'enterEmailAddress',
              defaultMessage: 'Enter your email address'
            })}
          />
        </Form.Item>
        <button
          type="submit"
          className={style['form-button']}
          disabled={submiting || countTime > 0}
        >
          {countTime > 0
            ? intl.formatMessage({ id: 'resendIn', defaultMessage: 'RESEND IN' })
            : intl.formatMessage({ id: 'send', defaultMessage: 'Send' })}
          &nbsp;
          {countTime > 0 && `${countTime}s`}
        </button>
      </Form>
      <div className="text-center">
        <p className={style.link}>
          <span>
            {intl.formatMessage({ id: 'haveAccountAlready', defaultMessage: 'Have an account already?' })}
          </span>
          &nbsp;
          <Link href="/">
            <span>
              {intl.formatMessage({ id: 'logInHere', defaultMessage: 'Log In Here.' })}
            </span>
          </Link>
        </p>
        <p className={style.link}>
          <span>
            {intl.formatMessage({ id: 'dontHaveAnAccountYet', defaultMessage: 'Don\'t have an account yet?' })}
          </span>
          &nbsp;
          <Link href="/register">
            <span>
              {intl.formatMessage({ id: 'signUpHere', defaultMessage: 'Sign up here.' })}
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
}
