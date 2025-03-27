'use client';

import { useMainThemeLayout } from 'src/providers/main-layout.provider';
import { Divider } from 'antd';
import { useIntl } from 'react-intl';
import style from './style.module.scss';
import GoogleLoginButton from './google-login-button';
import TwitterLoginButton from './twitter-login-button';

export default function SocialLoginGroup({ noredirect = false }: { noredirect?: boolean }) {
  const { settings } = useMainThemeLayout();
  const intl = useIntl();
  if (!settings.googleLoginEnabled && !settings.twitterLoginEnabled) return null;

  return (
    <div className={style['social-login']}>
      <TwitterLoginButton />
      {settings.googleLoginClientId && settings.googleLoginEnabled && (
        <GoogleLoginButton noredirect={noredirect} />
      )}
      <Divider className={style.or}>
        <span>{intl.formatMessage({ id: 'or', defaultMessage: 'Or' })}</span>
      </Divider>
    </div>
  );
}
