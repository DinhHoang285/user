'use client';

import { AiOutlineNotification } from 'react-icons/ai';
import PageHeading from '@components/common/page-heading';
import { useIntl } from 'react-intl';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

const PerformerPayoutRequestList = dynamic(() => import('@components/performer/list/performer-payout-repuest-list'), { ssr: false });

export default function PerformerPayoutRequestPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const intl = useIntl();
  const router = useRouter();

  useEffect(() => {
    if (!user.isPerformer) {
      router.push('/404');
    }
  }, []);
  return (
    <div className="main-container">
      <PageHeading title={intl.formatMessage({ id: 'payoutRequests', defaultMessage: 'Payout Requests' })} icon={<AiOutlineNotification />} />
      <PerformerPayoutRequestList />
    </div>
  );
}
