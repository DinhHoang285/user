'use client';

import Link from 'next/link';
import classNames from 'classnames';
import { useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useMainThemeLayout } from 'src/providers/main-layout.provider';
import { useSession } from 'next-auth/react';
import { Select } from 'antd';
import { COUNTRIES, getLocales, supportedLocales } from 'src/constants';
import { AiOutlineGlobal } from 'react-icons/ai';
import Cookies from 'js-cookie';
import { useMedia } from 'react-use-media';
import { useIntl } from 'react-intl';
import style from './style.module.scss';

interface IProps {
  isSideFooter?: boolean; // todo - remove?
}

export default function Footer({ isSideFooter = false }: IProps) {
  const { settings } = useMainThemeLayout();
  const { data: session } = useSession();
  const intl = useIntl();
  const locales = useMemo(() => getLocales(), []); // variable type?
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useMedia('(max-width: 768px)');

  const menus = settings.menus && settings.menus.length > 0 ? settings.menus.filter((m) => m.section === 'footer') : [];

  if (pathname.includes('/reels')) return null;
  if (pathname.includes('/messages') && isMobile) return null;

  const renderFlag = (langCultureName: string) => {
    const countryCode = langCultureName.split('-')[1] || langCultureName;
    const country = COUNTRIES.find((c) => countryCode.toLowerCase().includes(c.code.toLowerCase()));
    return country?.flag;
  };

  const renderLanguageMenu = () => {
    if (!supportedLocales) return null;

    const currentLocale = pathname.split('/')[1] || 'en';
    const currentLang = locales.find((l) => l.langCultureName.includes(currentLocale));

    return (
      <Select
        onChange={(locale) => {
          const newPath = `/${locale}${pathname.substring(currentLocale.length + 1)}`;
          Cookies.set('locale', locale);
          router.push(newPath);
        }}
        className={style['langs-select']}
        value={currentLang?.langCultureName.split('-')[0] || 'en'}
      >
        {locales.filter((locale) => supportedLocales.includes(locale.langCultureName.split('-')[0])).map((locale) => (
          <Select.Option
            key={locale.langCultureName}
            value={locale.langCultureName.split('-')[0]}
            disabled={locale.langCultureName === currentLang?.langCultureName}
          >
            <img src={renderFlag(locale.langCultureName)} alt="flag" height={20} />
            &nbsp;
            {' '}
            {locale.displayName || locale.langCultureName}
          </Select.Option>
        ))}
      </Select>
    );
  };

  const renderMenus = () => {
    if (!session?.user?._id) {
      return (
        <>
          <li>
            <Link href="/login">
              {intl.formatMessage({ id: 'logIn', defaultMessage: 'Log in' })}
            </Link>
          </li>
          <li>
            <Link href="/register">
              {intl.formatMessage({ id: 'signUp', defaultMessage: 'Sign up' })}
            </Link>
          </li>
        </>
      );
    }

    return (
      <>
        <li>
          <Link href="/home">
            {intl.formatMessage({ id: 'home', defaultMessage: 'Home' })}
          </Link>
        </li>
        <li>
          <Link href="/creator">
            {intl.formatMessage({ id: 'creator', defaultMessage: 'Creator' })}
          </Link>
        </li>
        <li>
          <Link href="/contact">
            {intl.formatMessage({ id: 'contact', defaultMessage: 'Contact' })}
          </Link>
        </li>
      </>
    );
  };

  return (
    <div
      className={classNames(style['main-footer'], {
        [style['side-footer']]: isSideFooter
      })}
      id="main-footer"
    >
      <div className={style['container-footer']}>
        {supportedLocales.length > 0 && (
          <div className={style['language-wrapper']}>
            <span className={style['language-icon']}>
              <AiOutlineGlobal />
              {renderLanguageMenu()}
            </span>
          </div>
        )}
        <ul>
          {renderMenus()}
          {menus.map((item) => (
            <li key={item._id}>
              <a rel="noreferrer" href={item.path} target={item.isNewTab ? '_blank' : ''}>
                {item.title}
              </a>
            </li>
          ))}
        </ul>
        <div className={style['main-footer-divider']} />
        {/* eslint-disable-next-line react/no-danger */}
        {settings.footerContent && <div className={style['footer-content']} dangerouslySetInnerHTML={{ __html: settings.footerContent }} />}
      </div>
    </div>
  );
}
