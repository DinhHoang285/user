'use client';

import { AiOutlineNotification } from 'react-icons/ai';
import PageHeading from '@components/common/page-heading';
import PayoutRequestForm from '@components/payout-request/form';
import { IUser } from '@interfaces/user';
import { showError, showSuccess } from '@lib/message';
import { Spin } from 'antd';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { payoutRequestService } from 'src/services';

interface IProps {
  valid: boolean;
}

function PayoutRequestContainer({ valid }: IProps) {
  const intl = useIntl();
  const [submiting, setsubmiting] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const user: IUser = session?.user as IUser;

  const calculateStatsPayout = async () => {
    await payoutRequestService.calculate();
  };

  useEffect(() => {
    if (!valid) {
      showError(
        intl.formatMessage({
          id: 'payoutRequestPending',
          defaultMessage: 'Your previous request is pending. Please wait before requesting new payout'
        })
      );
      router.back();
    } else {
      calculateStatsPayout();
    }
  }, []);

  useEffect(() => {
    if (!(user as any).isPerformer) {
      router.push('/404');
    }
  }, []);

  const submit = async (data) => {
    try {
      setsubmiting(true);
      await payoutRequestService.create(data);
      showSuccess(
        intl.formatMessage({
          id: 'payoutRequestSent',
          defaultMessage: 'Your payout request was sent!'
        })
      );
      (user as any)?.isPerformer ? router.push('/my-earning') : router.push('/payout-request');
    } catch (e) {
      showError(e);
      setsubmiting(false);
    }
  };

  if (!valid) {
    return (
      <div style={{ margin: 50 }} className="text-center">
        <Spin />
      </div>
    );
  }

  return (
    <div className="main-container">
      <PageHeading
        title={intl.formatMessage({
          id: 'newPayoutRequest',
          defaultMessage: 'New Payout Request'
        })}
        icon={<AiOutlineNotification />}
      />
      <PayoutRequestForm
        payout={{
          requestNote: '',
          requestTokens: 1,
          status: 'pending'
        }}
        submit={submit}
        submiting={submiting}
        user={user as any}
      />
    </div>
  );
}

export default PayoutRequestContainer;
