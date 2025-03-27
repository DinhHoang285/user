import PageHeading from '@components/common/page-heading';
import Notification from '@components/notification/Notification';
import { Metadata } from 'next';

export default function Messages() {
  return (
    <div className="main-container">
      <PageHeading title="Notification" className="hide-mobile" />
      <Notification style={{ width: 550, margin: '0px auto' }} />
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Notification',
  robots: 'noindex'
};
