'use client';

import classNames from 'classnames';
import { useMainThemeLayout } from 'src/providers/main-layout.provider';
import Image from 'next/image';
import style from './loader.module.scss';

interface IProps {
  active?: boolean;
  customText?: string;
}

function Loader({
  customText = '',
  active
}: IProps) {
  const { settings } = useMainThemeLayout();

  return (
    <div className={classNames(
      style['loading-screen'],
      {
        [style.active]: active
      }
    )}
    >
      <div style={{ textAlign: 'center' }}>
        {settings.logoUrl ? (
          <Image
            alt="header-fogy"
            width={400}
            height={120}
            src={settings.logoUrl || '/logo.png'}
          />
        ) : (settings.siteName || 'hello-you.com')}

        {customText && <p className="highlight-color">{customText}</p>}
      </div>
    </div>
  );
}

export default Loader;
