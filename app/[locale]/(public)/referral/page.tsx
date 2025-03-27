import PageHeading from '@components/common/page-heading';
import { AiOutlineGift } from 'react-icons/ai';
import ReferralContent from '@components/referral/referral-content';
import { Metadata } from 'next';

export const metadata : Metadata = {
  title: 'Referral'
};

export default function ReferralPage() {
  return (
    <div className="main-container">
      <PageHeading title="Referral" icon={<AiOutlineGift />} />
      <ReferralContent />
    </div>
  );
}
