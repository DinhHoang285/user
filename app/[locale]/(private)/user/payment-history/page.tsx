import PageHeading from '@components/common/page-heading';
import PaymentHistoryWrapper from '@components/payment/payment-history-wrapper';
import { AiOutlineHistory } from 'react-icons/ai';
import { Metadata } from 'next';

export default function PaymentHistoryPage() {
  return (
    <div className="main-container">
      <PageHeading title="Payment History" icon={<AiOutlineHistory />} />
      <PaymentHistoryWrapper />
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Payment History',
  robots: 'noindex'
};
