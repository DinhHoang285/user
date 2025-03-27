'use client';

import { useEffect } from 'react';
import { useGoogleOneTapLogin, googleLogout } from '@react-oauth/google';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { authService } from '@services/auth.service';
import { showError } from '@lib/message';
import { useIntl } from 'react-intl';

export default function SocialsLoginCallback() {
  const { data } = useSession();
  const oauthVerifier = useSearchParams().get('oauth_verifier');
  const router = useRouter();
  const intl = useIntl();

  useEffect(() => {
    const callbackTwitter = async () => {
      const twitterInfo = authService.getTwitterToken();
      if (!oauthVerifier || !twitterInfo.oauthToken || !twitterInfo.oauthTokenSecret) {
        return;
      }
      try {
        const res = await signIn('credentials', {
          type: 'twitter',
          oauth_verifier: oauthVerifier,
          oauthToken: twitterInfo.oauthToken,
          oauthTokenSecret: twitterInfo.oauthTokenSecret,
          role: 'user',
          redirect: false
        });
        if (res?.ok) {
          router.push('/home');
        }
        if (res?.error) {
          showError({ message: res.error });
        }
      } catch (e) {
        showError(e);
      }
    };
    callbackTwitter();
    return () => {
      googleLogout();
    };
  }, []);

  useGoogleOneTapLogin({
    onError: () => {
      showError(
        intl.formatMessage({
          id: 'loginFailedError',
          defaultMessage: 'Login failed!'
        })
      );
    },
    onSuccess: async (resp: any) => {
      if (!resp.credential || data?.user?._id) {
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
          router.push('/home');
        }
        if (res?.error) {
          showError({ message: res.error });
        }
      } catch (e) {
        showError(e);
      }
    },
    // track cookie and store
    disabled: !!data?.user?._id
  });

  return null;
}
