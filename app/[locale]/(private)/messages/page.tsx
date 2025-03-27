import PageHeading from '@components/common/page-heading';
import Messenger from '@components/messages/main-wrapper';
import { Metadata } from 'next';
import MessageProvider from 'src/providers/message.provider';

export default function Messages() {
  return (
    <div className="main-container-message">
      <PageHeading title="Messages" className="hide-mobile" />
      <MessageProvider>
        <Messenger />
      </MessageProvider>
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Messages',
  robots: 'noindex'
};
