'use client';

import { showError } from '@lib/message';
import { useGoogleLogin, useGoogleOneTapLogin } from '@react-oauth/google';
import { signIn, useSession } from 'next-auth/react';
import { useMainThemeLayout } from 'src/providers/main-layout.provider';
import { useRouter } from 'next/navigation';
import { GoogleSvg } from 'src/icons';
import { useIntl } from 'react-intl';
import style from './style.module.scss';

export default function GoogleLoginButton({ noredirect = true }: { noredirect?: boolean }) {
  const { setLoginModal } = useMainThemeLayout();
  const { data: session } = useSession();
  const router = useRouter();
  const intl = useIntl();

  const login = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (response) => {
      if (!response.code) return;
      try {
        const res = await signIn('credentials', {
          type: 'google',
          code: response.code,
          role: 'user',
          redirect: false
        });
        if (res?.ok) {
          !noredirect ? router.push(`${process.env.SITE_URL}`) : setLoginModal({ openForm: '' });
        }
        if (res?.error) {
          showError({ message: res.error });
        }
      } catch (e) {
        showError(e);
      }
    }
  });

  useGoogleOneTapLogin({
    onError: () => { alert(intl.formatMessage({ id: 'loginFailedError', defaultMessage: 'Login failed!' })); },
    onSuccess: async (resp: any) => {
      if (!resp.credential) {
        return;
      }
      try {
        const res = await signIn('credentials', {
          type: 'google-onetap',
          tokenId: resp.credential,
          role: 'user',
          redirect: false
        });
        if (res?.ok) {
          !noredirect ? router.push(`${process.env.SITE_URL}`) : setLoginModal({ openForm: '' });
        }
        if (res?.error) {
          showError({ message: res.error });
        }
      } catch (e) {
        showError(e);
      }
    },
    disabled: !!session?.user?._id
  });

  return (
    <button
      type="button"
      onClick={() => login()}
      className={`${style['login-btn']} ${style.google}`}
    >
      <GoogleSvg />
      {intl.formatMessage({ id: 'logInSignUpWithGoogle', defaultMessage: 'LOG IN / SIGN UP WITH GOOGLE' })}
    </button>
  );
}
