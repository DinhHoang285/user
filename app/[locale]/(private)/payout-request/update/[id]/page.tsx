import { AiOutlineArrowLeft } from 'react-icons/ai';
import PageHeading from '@components/common/page-heading';
// import FeedForm from '@components/post/performer-management/form';
import PayoutRequestUpdatePage from '@components/payout-request/payout-request-update-container';
import { IPage } from '@interfaces/ui-config';
import { TOKEN } from '@services/api-request';
import { payoutRequestService } from '@services/index';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

export default async function EditPayoutRequest(props: IPage) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(TOKEN)?.value || '';
    const params = await props.params;

    const resp = await payoutRequestService.detail(`${params.id}`, {
      Authorization: token
    });

    if (!resp) {
      notFound();
    }
    return (
      <div className="main-container">
        <PageHeading icon={<AiOutlineArrowLeft />} title="Edit Post" />
        <PayoutRequestUpdatePage payout={resp.data} />
      </div>
    );
  } catch {
    notFound();
  }
}

export const metadata: Metadata = {
  title: 'Edit Post'
};
