import { ReactNode } from 'react';
import Footer from '@layouts/footer';
import withHydrationOnDemand from 'react-hydration-on-demand';

const FooterHydration = withHydrationOnDemand({ on: ['idle', 'visible'] })(
  Footer
);

export default async function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="body-content">
        {children}
      </div>
      <FooterHydration />
    </>
  );
}
