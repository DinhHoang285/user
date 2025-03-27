'use client';

import { XIcon } from 'react-share';
import { authService } from '@services/auth.service';
import { showError } from '@lib/message';
import { useIntl } from 'react-intl';
import style from './style.module.scss';

export default function TwitterLoginButton() {
  const intl = useIntl();
  return (
    <button
      type="button"
      aria-label="twitter-btn"
      className={`${style['login-btn']} ${style.twitter}`}
      onClick={async () => {
        try {
          const { data: resp } = await authService.loginTwitter({ role: 'user' });
          authService.setTwitterToken({
            oauthToken: resp.oauth_token,
            oauthTokenSecret: resp.oauth_token_secret
          }, 'user');
          window.location.href = resp.url;
        } catch (e) {
          showError(e);
        }
      }}
    >
      <XIcon />
      {intl.formatMessage({ id: 'loginSignUpWithTwitter', defaultMessage: 'LOG IN / SIGN UP WITH TWITTER' })}
    </button>
  );
}
