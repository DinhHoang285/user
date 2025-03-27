import PageHeading from '@components/common/page-heading';
import SubscriptionWrapper from '@components/subscription/subscription-wrapper';
import { Metadata } from 'next';
import { AiOutlineHeart } from 'react-icons/ai';

export default function SubscriptionPage() {
  return (
    <div className="main-container">
      <PageHeading title="My Subscriptions" icon={<AiOutlineHeart />} />
      <SubscriptionWrapper />
    </div>
  );
}

export const metadata: Metadata = {
  title: 'My Subscriptions',
  robots: 'noindex'
};
