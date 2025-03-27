import PageHeading from '@components/common/page-heading';
import PerformerBlockList from '@components/performer/list/performer-block-user-list';
import { Metadata } from 'next';
import { AiOutlineBlock } from 'react-icons/ai';

export default function BlockPage() {
  return (
    <div className="main-container">
      <PageHeading icon={<AiOutlineBlock />} title="Blacklist" />
      <PerformerBlockList />
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Blacklist'
};
