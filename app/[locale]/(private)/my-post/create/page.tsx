import PageHeading from '@components/common/page-heading';
import FeedForm from '@components/feed/form/feed-form';
import { Metadata } from 'next';
import { AiOutlineFire } from 'react-icons/ai';

export default function CreatePost() {
  return (
    <div className="main-container">
      <PageHeading title="New Post" icon={<AiOutlineFire />} />
      <FeedForm />
    </div>
  );
}

export const metadata: Metadata = {
  title: 'New Post'
};
