import PageHeading from '@components/common/page-heading';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { orderService } from 'src/services';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import OrderDetailForm from '@components/order/order-detail-form';
import { TOKEN } from '@services/api-request';
import { IPage } from '@interfaces/ui-config';

export default async function OrderDetailPage(props: IPage) {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN)?.value || '';
  const params = await props.params;

  try {
    const resp = await orderService.findById(params.id, {
      Authorization: token
    });
    const order = resp.data;

    return (
      <div className="main-container">
        <PageHeading title={`#${order.orderNumber || ''}`} icon={<AiOutlineShoppingCart />} />
        <OrderDetailForm order={order} />
      </div>
    );
  } catch (error) {
    notFound();
  }
}
