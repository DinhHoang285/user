import '../../style/index.scss';
import { authOptions } from '@lib/auth';
import { GoogleTagManager } from '@next/third-parties/google';
import { settingService } from '@services/setting.service';
import { Metadata, Viewport } from 'next';
import { getServerSession } from 'next-auth';
import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';
import MainLayoutProvider from 'src/providers/main-layout.provider';
import SessionProvider from 'src/providers/session.provider';
import ToastyConfig from '@components/common/toasty';
import I18nextProvider from 'src/i18n/I18nextProvider';
import localFont from 'next/font/local';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import { cookies } from 'next/headers';
import { defaultLocale } from 'src/constants';

const myfont = localFont({
  src: [
    {
      path: './calibri-font/calibri-regular.ttf',
      weight: 'normal'
    },
    {
      path: './calibri-font/calibri-bold.ttf',
      weight: '600'
    },
    {
      path: './calibri-font/calibri-bold.ttf',
      weight: 'bold'
    }
  ],
  display: 'swap',
  preload: true,
  variable: '--font-calibri'
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await settingService.all();

    const metadata = {
      title: settings?.homeTitle || '',
      description: settings.homeMetaDescription ? settings.homeMetaDescription.slice(0, 165) : ''
    };
    const canonicalUrl = `${process.env.SITE_URL}`;

    return {
      ...metadata,
      icons: {
        other: {
          url: settings?.favicon || '/favicon.ico',
          sizes: '64x64',
          type: 'image/x-icon'
        }
      },
      appleWebApp: {
        statusBarStyle: 'black-translucent'
      },
      other: {
        charSet: 'utf-8'
      },
      metadataBase: new URL(process.env.SITE_URL),
      alternates: {
        canonical: canonicalUrl
      },
      twitter: {
        ...metadata,
        card: 'summary'
      },
      openGraph: {
        ...metadata,
        url: canonicalUrl
      },
      robots: {
        index: true,
        follow: true
      }
    };
  } catch {
    return {
      robots: {
        index: false,
        follow: false
      }
    };
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  height: 'device-height',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fff' }
  ]
};

export const revalidate = 3600;

export default async function RootLayout({ children }: { children: ReactNode }) {
  const [settings, session, cookieState] = await Promise.all([
    settingService.all(),
    getServerSession(authOptions),
    cookies()
  ]);

  const locale = cookieState.get('locale')?.value || defaultLocale;

  return (
    <html className={myfont.className} data-theme="light" lang={locale} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <link rel="preconnect" href="'https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://jnn-pa.googleapis.com" />
      </head>
      <body>
        <GoogleOAuthProvider clientId={settings.googleLoginClientId || ''}>
          <SessionProvider session={session}>
            <MainLayoutProvider settings={settings}>
              <I18nextProvider locale={locale}>
                <ThemeProvider themes={['light', 'dark']} defaultTheme="light">
                  <AntdRegistry hashPriority="high">
                    <ConfigProvider
                      theme={{
                        token: {
                          colorPrimary: '#d36cd3',
                          colorInfo: '#d36cd3',
                          colorLink: '#d36cd3',
                          fontFamily: 'inherit'
                        },
                        hashed: false
                      }}
                    >
                      {children}
                    </ConfigProvider>
                  </AntdRegistry>
                </ThemeProvider>
              </I18nextProvider>
            </MainLayoutProvider>
          </SessionProvider>
        </GoogleOAuthProvider>
        <ToastyConfig />
        {settings.ga && <GoogleTagManager gtmId={settings.ga} />}
      </body>
    </html>
  );
}
