import PageHeading from '@components/common/page-heading';
import OrderDetailsWrapper from '@components/order/order-details-wrapper';
import { getIpFromHeaders } from '@lib/request-header';
import { orderService } from '@services/order.service';
import { cookies, headers } from 'next/headers';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { Metadata } from 'next';
import { TOKEN } from '@services/api-request';
import { IPage } from '@interfaces/ui-config';

export default async function OrderDetails(props: IPage) {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN)?.value || '';
  const headersList = await headers();
  const xClientIp = getIpFromHeaders(headersList);
  const params = await props.params;

  const { data } = await orderService.findById(`${params?.id}`, {
    Authorization: token,
    'x-client-ip': xClientIp
  });

  return (
    <div className="main-container">
      <PageHeading title={`#${data?.orderNumber}`} icon={<AiOutlineShoppingCart style={{ transform: 'translateY(3px)' }} />} />
      <OrderDetailsWrapper order={data} />
    </div>
  );
}

export async function generateMetadata(props: IPage): Promise<Metadata> {
  const params = await props.params;
  return {
    title: `Order #${params.id}`,
    robots: { index: false }
  };
}
