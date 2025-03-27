import { AiOutlineFire } from 'react-icons/ai';
import PageHeading from '@components/common/page-heading';
import { Metadata } from 'next';
import PerformerVideosList from '@components/performer/list/performer-bulk-video.list';
import PerformerFeedListing from '@components/performer/list/performer-feed-list';

export default function PostListing() {
  return (
    <div className="main-container">
      <PageHeading title="My Posts" icon={<AiOutlineFire />} />
      <PerformerFeedListing />
      <PerformerVideosList />
    </div>
  );
}

export const metadata: Metadata = {
  title: 'My Posts'
};
