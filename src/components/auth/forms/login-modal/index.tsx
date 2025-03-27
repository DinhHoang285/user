'use client';

import Image from 'next/image';
import { useMainThemeLayout } from 'src/providers/main-layout.provider';
import { Modal } from 'antd';
import { useIntl } from 'react-intl';
import LoginForm from '@components/auth/forms/login-form';
import SocialLoginGroup from '@components/auth/social-login-group';
import style from './style.module.scss';

function LoginModal() {
  const { openForm, setLoginModal, settings } = useMainThemeLayout();
  const intl = useIntl();

  if (!openForm) return null;

  return (
    <Modal
      title=""
      footer={false}
      open={!!openForm}
      onCancel={() => setLoginModal({ openForm: '' })}
      width={447}
      height={730}
    >
      <div className="main-container">
        <div className={style['login-box']}>
          <div className={`${style['content-right']}`}>
            <div className={style.logo}>
              {settings.logoUrl ? (
                <Image
                  alt="header-fogy"
                  width={90}
                  height={60}
                  src={settings.logoUrl}
                />
              ) : (settings.siteName || 'helloyou.com')}
            </div>
            <p className="text-center">
              <small>{intl.formatMessage({ id: 'signUpToMakeMoney', defaultMessage: 'Sign up to make money and interact with your fans!' })}</small>
            </p>
            <SocialLoginGroup />
            <LoginForm />
          </div>
        </div>
      </div>
    </Modal>

  );
}

export default LoginModal;
