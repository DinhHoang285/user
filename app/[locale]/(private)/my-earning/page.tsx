import { AiOutlineDollar } from 'react-icons/ai';
import PageHeading from '@components/common/page-heading';
import PerformerEarningList from '@components/performer/list/performer-earning-list';
import { Metadata } from 'next';

export default function EarningPage() {
  return (
    <div className="main-container">
      <PageHeading icon={<AiOutlineDollar />} title="Earnings" />
      <PerformerEarningList />
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Earnings'
};
