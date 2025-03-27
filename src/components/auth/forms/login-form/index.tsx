'use client';

import { showError, showSuccess } from '@lib/message';
import { passwordLogin, usernameLogin } from '@lib/validation';
import { authService } from '@services/auth.service';
import { Divider, Form, Input } from 'antd';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useMainThemeLayout } from 'src/providers/main-layout.provider';
import dynamic from 'next/dynamic';
import style from './style.module.scss';

const VerifyOTPModel = dynamic(() => import('@components/auth/verify-otp'), { ssr: false });

export interface ICodeState {
  code: string;
  openModal: boolean;
  loading: boolean;
  expiry: number;
  email: string;
}

export default function LoginForm({ noredirect = false }: { noredirect?: boolean }) {
  const [isLoading, setIsLoading] = useState(false);
  const { settings, setLoginModal } = useMainThemeLayout();
  const siteName = settings?.siteName || 'Hello You';
  const router = useRouter();
  const intl = useIntl();
  const [savedValues, setSavedValues] = useState({});
  const [codeState, setCodeState] = useState<ICodeState>({
    code: '',
    openModal: false,
    loading: false,
    expiry: 60,
    email: ''
  });
  const expiredRef = useRef<any>(null);

  const handleLoginSucces = async (token) => {
    try {
      const res = await signIn('credentials', {
        ...savedValues,
        redirect: false,
        token
      });
      if (res?.ok && !res?.error) {
        router.push('/home');
      }
    } catch (e) {
      const error = await e;
      showError(error);
    }
  };

  const handelLogin = async (val) => {
    setIsLoading(true);
    setSavedValues(val);
    const res = await signIn('credentials', {
      ...val,
      redirect: false
    });

    if (res?.ok && !res?.error) {
      if (noredirect) {
        setLoginModal({ openForm: '' });
      } else {
        router.push('/home');
        setLoginModal({ openForm: '' });
      }
    }

    if (res?.error && res?.ok) {
      try {
        const errorData = JSON.parse(res.error);
        if (errorData.enable2StepEmail) {
          setCodeState((prev) => ({
            ...prev,
            openModal: true,
            email: errorData.email
          }));
          expiredRef.current = setInterval(() => {
            setCodeState((prev) => ({ ...prev, expiry: prev.expiry - 1 }));
          }, 1000);
        }
      } catch {
        console.error(
          intl.formatMessage({ id: 'loginFailedError', defaultMessage: 'Login failed:' }),
          res.error
        );
      }
    }
    if (res?.error && !res?.ok) {
      router.refresh();
      showError(res.error);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    const { expiry } = codeState;
    if (expiry === 0) {
      expiredRef.current && clearInterval(expiredRef.current);
      setCodeState((prev) => ({ ...prev, expiry: 60 }));
    }
  }, [codeState.expiry]);

  return (
    <div className="auth-form">
      <Form
        className={style['form-login']}
        initialValues={{ remember: true }}
        onFinish={handelLogin}
      >
        <Form.Item
          name="username"
          validateTrigger={['onChange', 'onBlur']}
          rules={usernameLogin}
        >
          <Input disabled={isLoading} placeholder={intl.formatMessage({ id: 'emailorUsername', defaultMessage: 'Email or Username' })} />
        </Form.Item>
        <Form.Item
          name="password"
          validateTrigger={['onChange', 'onBlur']}
          rules={passwordLogin}
        >
          <Input.Password disabled={isLoading} placeholder={intl.formatMessage({ id: 'password', defaultMessage: 'Password' })} />
        </Form.Item>
        {!noredirect && (
          <p className={style['forgot-pass']}>
            <Link href="/forgot-password">
              {intl.formatMessage({ id: 'forgotPassword', defaultMessage: 'Forgot password?' })}
            </Link>
          </p>
        )}
        <button
          disabled={isLoading}
          type="submit"
          className={`${style['btn-login']} submit-btn`}
        >
          {intl.formatMessage({ id: 'logIn', defaultMessage: 'LOG IN' })}
        </button>
      </Form>
      {codeState.openModal && (
        <VerifyOTPModel
          codeState={codeState}
          setCodeState={setCodeState}
          onResend={async () => {
            try {
              await handelLogin(savedValues);
              showSuccess(
                intl.formatMessage({ id: 'codeHasBeenSent', defaultMessage: 'Code has been sent!' })
              );
            } catch (error) {
              const e = error.resovle();
              showError(e);
            }
          }}
          onVerify={async () => {
            const { code, email } = codeState;
            if (!code || code.length !== 6) {
              showError(
                intl.formatMessage({ id: 'yourOTPIsInvalid', defaultMessage: 'Your OTP is invalid!' })
              );
              return;
            }
            if (!email) {
              setCodeState((prev) => ({ ...prev, openModal: false }));
              showError(
                intl.formatMessage({ id: 'pleaseLogin', defaultMessage: 'Please Login!' })
              );
            }
            try {
              setCodeState((prev) => ({ ...prev, loading: true }));
              const resp = await authService.checkCodeLogin({
                email, code
              });
              const { token } = resp.data;
              handleLoginSucces(token);
            } catch (e) {
              const error = await e;
              showError(error);
            } finally {
              setCodeState((prev) => ({ ...prev, openModal: false, loading: false }));
            }
          }}
        />
      )}
      {!noredirect ? (
        <div className="text-center">
          <p style={{ fontSize: 14 }}>
            <span>{intl.formatMessage({ id: 'visit', defaultMessage: 'Visit' })}</span>
            {' '}
            <Link style={{ color: '#d36cd3' }} href="/page/help">
              <span>{intl.formatMessage({ id: 'helpCenter', defaultMessage: 'Help Center' })}</span>
            </Link>
            {' '}
            <span>{intl.formatMessage({ id: 'forAnyHelpIfYou', defaultMessage: 'for any help if you are not able to login with your existing' })}</span>
            {' '}
            <span>{siteName}</span>
            {' '}
            <span>{intl.formatMessage({ id: 'account', defaultMessage: 'account' })}</span>
          </p>
          <Divider className={style['login-form-devide']} />
          <p style={{ marginBottom: 5 }}>
            <span>{intl.formatMessage({ id: 'dontHaveAnAccountYet', defaultMessage: 'Don\'t have an account yet?' })}</span>
          </p>
          <p>
            <Link style={{ color: '#d36cd3', fontSize: 15, fontWeight: 'lighter' }} href="/register">
              <span>{intl.formatMessage({ id: 'signUpFor', defaultMessage: `Sign up for ${siteName}` })}</span>
            </Link>
          </p>
        </div>
      ) : (
        <div className="text-center">
          <p style={{ marginBottom: 5 }}>
            <span>{intl.formatMessage({ id: 'dontHaveAnAccountYet', defaultMessage: 'Don\'t have an account yet?' })}</span>
          </p>
          <p>
            <a aria-hidden onClick={() => setLoginModal({ openForm: 'signup' })}>
              <span>{intl.formatMessage({ id: 'logInHere', defaultMessage: 'Log in here.' })}</span>
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
