import NotFoundContent from '@components/not-found';
import withHydrationOnDemand from 'react-hydration-on-demand';
import Header from '@layouts/header';
import Footer from '@layouts/footer';

const HeaderHydration = withHydrationOnDemand({ on: ['idle', 'visible'] })(
  Header
);
const FooterHydration = withHydrationOnDemand({ on: ['idle', 'visible'] })(
  Footer
);

export default async function NotFound() {
  return (
    <>
      <HeaderHydration />
      <div className="body-content">
        <NotFoundContent />
      </div>
      <FooterHydration />
    </>
  );
}
