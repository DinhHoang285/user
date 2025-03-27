'use client';

import { showError, showSuccess } from '@lib/message';
import { Form, Input } from 'antd';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { authService } from '@services/auth.service';
import { useMainThemeLayout } from 'src/providers/main-layout.provider';
import { AiOutlineLink } from 'react-icons/ai';
import {
  usernameValidate, emailValidate, passwordValidate, firstNameValidate, lastNameValidate
} from '@lib/validation';
import { useIntl } from 'react-intl';
import style from './style.module.scss';

export default function FanRegisterForm({ noredirect = false }: { noredirect?: boolean }) {
  const [requesting, setRequesting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const rel = searchParams.get('rel');
  const { setLoginModal, settings } = useMainThemeLayout();
  const intl = useIntl();

  return (
    <div className={`auth-form ${style['register-fan']}`}>
      <Form
        labelCol={{ span: 24 }}
        initialValues={{ gender: 'male', rel }}
        onFinish={async (values) => {
          const data = { ...values, commission: settings.userReferralCommission };
          try {
            setRequesting(true);
            const resp = (await authService.register(data)).data;
            showSuccess(
              resp?.message
              || intl.formatMessage({ id: 'signUpSuccess', defaultMessage: 'Sign up success!' })
            );
            if (noredirect) {
              setLoginModal({ openForm: 'login' });
            } else {
              router.push('/');
            }
            setRequesting(false);
          } catch (e) {
            showError(e);
            setRequesting(false);
          }
        }}
        scrollToFirstError
      >
        <Form.Item
          name="firstName"
          validateTrigger={['onChange', 'onBlur']}
          rules={firstNameValidate}
        >
          <Input placeholder={intl.formatMessage({ id: 'firstName', defaultMessage: 'First name' })} />
        </Form.Item>
        <Form.Item
          name="lastName"
          validateTrigger={['onChange', 'onBlur']}
          rules={lastNameValidate}
        >
          <Input placeholder={intl.formatMessage({ id: 'lastName', defaultMessage: 'Last name' })} />
        </Form.Item>
        <Form.Item
          name="username"
          validateTrigger={['onChange', 'onBlur']}
          rules={usernameValidate}
        >
          <Input placeholder={intl.formatMessage({ id: 'usernamePlaceholder', defaultMessage: 'User name: jonh123, smith,...' })} />
        </Form.Item>
        <Form.Item
          name="email"
          validateTrigger={['onChange', 'onBlur']}
          rules={emailValidate}
        >
          <Input placeholder={intl.formatMessage({ id: 'emailAddress', defaultMessage: 'Email address' })} />
        </Form.Item>
        <Form.Item
          name="password"
          validateTrigger={['onChange', 'onBlur']}
          rules={passwordValidate}
        >
          <Input.Password
            className={style['input-password']}
            placeholder={intl.formatMessage({ id: 'password', defaultMessage: 'Password' })}
          />
        </Form.Item>
        <Form.Item
          className="referral"
          name="rel"
          validateTrigger={['onChange', 'onBlur']}
          rules={[]}
        >
          <Input
            style={{ border: 'none', padding: '0' }}
            placeholder={intl.formatMessage({ id: 'referralCode', defaultMessage: 'Referral code' })}
            prefix={<span><AiOutlineLink /></span>}
          />
        </Form.Item>
        <button
          type="submit"
          className="submit-btn"
          disabled={requesting}
        >
          <span>{intl.formatMessage({ id: 'signUp', defaultMessage: 'SIGN UP' })}</span>
        </button>
      </Form>
      {!noredirect ? (
        <div className="text-center">
          <p>
            <span>{intl.formatMessage({ id: 'signingUpYouAgree', defaultMessage: 'By signing up you agree to our' })}</span>
            {' '}
            <Link href="/page/term-of-service" target="_blank" style={{ color: '#d36cd3' }}>
              <span>{intl.formatMessage({ id: 'termsOfService', defaultMessage: 'Terms of Service' })}</span>
            </Link>
            {' '}
            <span>{intl.formatMessage({ id: 'and', defaultMessage: 'and' })}</span>
            {' '}
            <Link href="/page/privacy-policy" target="_blank" style={{ color: '#d36cd3' }}>
              <span>{intl.formatMessage({ id: 'privacyPolicy', defaultMessage: 'Privacy Policy' })}</span>
            </Link>
            ,
            {' '}
            <span>{intl.formatMessage({ id: 'confirm18YearsOld', defaultMessage: 'and confirm that you are at least 18 years old.' })}</span>
          </p>
          <p>
            <span>{intl.formatMessage({ id: 'haveAnAccountAlready', defaultMessage: 'Have an account already?' })}</span>
            &nbsp;
            <Link href="/" style={{ color: '#d36cd3' }}>
              <span>{intl.formatMessage({ id: 'logInHere', defaultMessage: 'Log in here.' })}</span>
            </Link>
          </p>
          <p>
            <span>{intl.formatMessage({ id: 'areYouACreator', defaultMessage: 'Are you a creator?' })}</span>
            &nbsp;
            <Link href="/creator-register" style={{ color: '#d36cd3' }}>
              <span>{intl.formatMessage({ id: 'signUpHere', defaultMessage: 'Sign up here.' })}</span>
            </Link>
          </p>
        </div>
      ) : (
        <p>
          <span>{intl.formatMessage({ id: 'haveAccountAlready', defaultMessage: 'Have an account already?' })}</span>
          &nbsp;
          <a aria-hidden onClick={() => setLoginModal({ openForm: 'login' })}>
            <span>{intl.formatMessage({ id: 'logInHere', defaultMessage: 'Log in here.' })}</span>
          </a>
        </p>
      )}
    </div>
  );
}
