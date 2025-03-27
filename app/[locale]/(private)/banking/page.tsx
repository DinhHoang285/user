import { AiFillBank } from 'react-icons/ai';
import PageHeading from '@components/common/page-heading';
import BankingSettingsTabs from '@components/performer/tabs/bankingTabs';
import { Metadata } from 'next';

export default function BankingPage() {
  return (
    <div className="main-container">
      <PageHeading icon={<AiFillBank />} title="Banking (to earn)" />
      <BankingSettingsTabs />
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Banking (to earn)'
};
