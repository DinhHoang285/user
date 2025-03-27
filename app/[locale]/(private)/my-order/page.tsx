import { AiOutlineShoppingCart } from 'react-icons/ai';
import PageHeading from '@components/common/page-heading';
import PerformerOrderList from '@components/performer/list/performer-order-list';
import { Metadata } from 'next';

export default function ModelOrderPage() {
  return (
    <div className="main-container">
      <PageHeading title="My Orders" icon={<AiOutlineShoppingCart />} />
      <PerformerOrderList />
    </div>
  );
}

export const metadata: Metadata = {
  title: 'My Orders'
};
