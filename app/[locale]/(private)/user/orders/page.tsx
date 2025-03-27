import PageHeading from '@components/common/page-heading';
import OrderWrapper from '@components/order/order-wrapper';
import { Metadata } from 'next';
import { AiOutlineShoppingCart } from 'react-icons/ai';

export default function UserOrderPage() {
  return (
    <div className="main-container">
      <PageHeading title="My Orders" icon={<AiOutlineShoppingCart style={{ transform: 'translateY(3px)' }} />} />
      <OrderWrapper />
    </div>
  );
}

export const metadata: Metadata = {
  title: 'My Orders',
  robots: 'noindex'
};
