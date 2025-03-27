import PageHeading from '@components/common/page-heading';
import WalletTransactionWrapper from '@components/wallet/wallet-transaction-wrapper';
import { AiOutlineHistory } from 'react-icons/ai';
import { Metadata } from 'next';

export default function WalletTransaction() {
  return (
    <div className="main-container">
      <PageHeading title="Wallet Transactions" icon={<AiOutlineHistory />} />
      <WalletTransactionWrapper />
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Wallet Transactions',
  robots: 'noindex'
};
