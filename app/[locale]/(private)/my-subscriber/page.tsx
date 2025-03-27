import PageHeading from '@components/common/page-heading';
import { Metadata } from 'next';
import { AiOutlineHeart } from 'react-icons/ai';
import dynamic from 'next/dynamic';

const PerformerSubscriberList = dynamic(() => import('@components/performer/list/performer-subscription-list'));

export default function SubscriberPage() {
  return (
    <div className="main-container">
      <PageHeading title="My Subscriptions" icon={<AiOutlineHeart />} />
      <PerformerSubscriberList />
    </div>
  );
}

export const metadata: Metadata = {
  title: 'My Subscriptions',
  robots: 'noindex'
};
