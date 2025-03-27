import { payoutRequestService } from 'src/services';
import { cookies } from 'next/headers';
import PayoutRequestContainer from '@components/payout-request/payout-request-create-container';
import { TOKEN } from '@services/api-request';

async function getData() {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN)?.value || '';

  const resp = await payoutRequestService.checkPending({
    Authorization: token || ''
  });

  return {
    valid: resp.data.valid
  };
}
export default async function PayoutRequestCreatePage() {
  const { valid } = await getData();
  return (
    <PayoutRequestContainer valid={valid} />
  );
}
