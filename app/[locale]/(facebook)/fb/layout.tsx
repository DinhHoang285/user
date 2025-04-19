import FooterFb from '@layouts/facebook/footer';
import HeaderFb from '@layouts/facebook/header';
import { ReactNode } from 'react';
import withHydrationOnDemand from 'react-hydration-on-demand';
import { Socket } from 'src/socket';

const HeaderHydration = withHydrationOnDemand({ on: ['idle', 'visible'] })(
  HeaderFb
);
const FooterHydration = withHydrationOnDemand({ on: ['idle', 'visible'] })(
  FooterFb
);

export default function MainLayoutTheme({ children }: { children: ReactNode; }) {
  return (
    <Socket>
      <HeaderHydration />
      <div className="body-content">
        {children}
      </div>
      <FooterHydration />
    </Socket>
  );
}
