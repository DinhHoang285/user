import PageHeading from '@components/common/page-heading';
import PurchasedContentWrapper from '@components/performer/purchased/purchased-content-wrapper';
import { AiOutlineHistory } from 'react-icons/ai';
import { Metadata } from 'next';

export default function PurchasedContentPage() {
  return (
    <div className="main-container">
      <PageHeading
        title="MY PURCHASED"
        icon={<AiOutlineHistory style={{ transform: 'translateY(3px)' }} />}
      />
      <PurchasedContentWrapper />
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Purchased Content',
  robots: 'noindex'
};
