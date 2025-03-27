'use client';

import { AiOutlineNotification } from 'react-icons/ai';
import PageHeading from '@components/common/page-heading';
import { showError, showSuccess } from '@lib/message';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import {
  IUser,
  PayoutRequestInterface
} from 'src/interfaces';
import { payoutRequestService } from 'src/services';

const PayoutRequestForm = dynamic(() => import('@components/payout-request/form'));

interface IProps {
  payout: PayoutRequestInterface;
}

export default function PayoutRequestUpdatePage({ payout }: IProps) {
  const intl = useIntl();
  const [submiting, setsubmiting] = useState(false);
  const { data: session } = useSession();
  const user: IUser = session?.user as IUser;
  const router = useRouter();

  const calculateStatsPayout = async () => {
    await payoutRequestService.calculate();
  };

  useEffect(() => {
    if (!user.isPerformer) {
      router.back();
    }
    if (!payout) {
      showError(intl.formatMessage({ id: 'notFindPayoutRequest', defaultMessage: 'Could not find payout request' }));
      router.back();
    }
    calculateStatsPayout();
  }, []);

  const submit = async (data: {
    paymentAccountType: string;
    requestNote: string;
    requestTokens: number;
  }) => {
    if (['done', 'approved', 'rejected'].includes(payout.status)) {
      showError(intl.formatMessage({ id: 'recheckRequestPayoutStatus', defaultMessage: 'Please recheck request payout status' }));
      return;
    }
    try {
      setsubmiting(true);
      const body = {
        paymentAccountType: data.paymentAccountType,
        requestTokens: data.requestTokens,
        requestNote: data.requestNote
      };
      await payoutRequestService.update(payout._id, body);
      showSuccess(intl.formatMessage({ id: 'changesSaved', defaultMessage: 'Changes saved!' }));
      user?.isPerformer ? router.push('/my-earning') : router.push('/payout-request');
    } catch (e) {
      const error = await Promise.resolve(e);
      showError(error?.message || intl.formatMessage({ id: 'errorOccurred', defaultMessage: 'Error occurred, please try again later' }));
      setsubmiting(false);
    }
  };

  return (
    <div className="main-container">
      <PageHeading title={intl.formatMessage({ id: 'editPayoutRequest', defaultMessage: 'Edit Payout Request' })} icon={<AiOutlineNotification />} />
      <PayoutRequestForm
        payout={payout}
        submit={submit}
        submiting={submiting}
        user={user as any}
      />
    </div>
  );
}
