import Footer from '@layouts/footer';
import Header from '@layouts/header';
import LoginModal from '@components/auth/forms/login-modal';
import dynamic from 'next/dynamic';
import { ReactNode } from 'react';
import withHydrationOnDemand from 'react-hydration-on-demand';
import { Socket } from 'src/socket';

const ScrollToTopBtn = dynamic(() => import('@components/common/base/scroll-to-top-btn'), { ssr: !!false });
const SocialsLoginCallback = dynamic(() => import('@components/auth/social-login-group/socials-login-callback'), { ssr: !!false });
const SubscriptionModal = dynamic(() => import('@components/subscription/subscription-modal'), { ssr: !!false });

const LoginModalHydration = withHydrationOnDemand({ on: ['idle', 'visible'] })(
  LoginModal
);

const HeaderHydration = withHydrationOnDemand({ on: ['idle', 'visible'] })(
  Header
);
const FooterHydration = withHydrationOnDemand({ on: ['idle', 'visible'] })(
  Footer
);

export default function MainLayoutTheme({ children }: { children: ReactNode; }) {
  return (
    <Socket>
      <HeaderHydration />
      <div className="body-content">
        {children}
      </div>
      <FooterHydration />
      <ScrollToTopBtn />
      <SubscriptionModal />
      <SocialsLoginCallback />
      <LoginModalHydration />
    </Socket>
  );
}
