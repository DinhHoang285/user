/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import Logo from '@components/auth/logo';
import Image from 'next/image';
import { ReactNode } from 'react';
import { useMainThemeLayout } from 'src/providers/main-layout.provider';
import { usePathname } from 'next/navigation';
import { useIntl } from 'react-intl';
import Link from 'next/link';
import style from './auth-wrapper.module.scss';

interface P {
  isMobile: boolean;
  children: ReactNode;
  title?: string | ReactNode;
  description?: string;
}

export default function AuthWrapper({
  isMobile, children, title = '', description = ''
}: P) {
  const { settings } = useMainThemeLayout();
  const pathName = usePathname();
  const intl = useIntl();
  let textTitle = '';
  switch (title) {
    case 'fanSignUp':
      textTitle = 'Fan Sign Up';
      break;
    case 'resetPassword':
      textTitle = 'Reset Password';
      break;
    case 'contactUs':
      textTitle = 'Reset Password';
      break;
    default:
      textTitle = '';
      break;
  }

  return (
    <div className="main-container">
      <div className={style.layout__login__register}>
        {pathName === '/fan-register' ? (
          <p className={style['link-auth-creator']}>
            <small>
              {intl.formatMessage({ id: 'creatorMustCreateAccountOn', defaultMessage: 'Do not create an account on this page if you are a creator. Creators must create an account on' })}
              {' '}
              <Link href="/creator-register">{intl.formatMessage({ id: 'thisLink', defaultMessage: 'this link' })}</Link>
            </small>
          </p>
        ) : null}
        <div className="login-box">
          <div className="content-left">
            <Image
              alt="welcome-placeholder"
              fill
              priority
              quality={70}
              sizes="(max-width: 768px) 100vw, (max-width: 2100px) 40vw"
              src={settings.loginPlaceholderImage || '/auth-img.png'}
            />
          </div>
          <div className="content-right">
            <div className="logo">
              {pathName.includes('fan-register')
                ? null
                : (
                  <Logo
                    logoUrl={(settings as any).logoUrl}
                    darkmodeLogoUrl={(settings as any).darkmodeLogoUrl}
                    siteName={settings.siteName}
                  />
                )}
              <h1 className="auth-wrapper-title">
                {
                  title
                    ? intl.formatMessage({ id: `${title}`, defaultMessage: `${textTitle}` }) : null
                }
              </h1>
            </div>
            {description && (
              <p className={`${style['description-text']} text-center`}>
                <small>{description}</small>
              </p>
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
