'use client';

import { AiOutlineHistory, AiOutlineHome } from 'react-icons/ai';
import { IUser } from '@interfaces/user';
import { Button, Result } from 'antd';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useIntl } from 'react-intl';

function SuccessBox() {
  const intl = useIntl();
  const router = useRouter();
  const { data: session } = useSession();
  const user: IUser = session?.user as IUser;
  return (
    <Result
      status="success"
      title={intl.formatMessage({ id: 'paymentSuccess', defaultMessage: 'Payment Success' })}
      subTitle={(
        <span style={{ color: '#707070' }}>
          {intl.formatMessage({
            id: 'paymentMessageSuccess',
            defaultMessage: `Hi ${user.username}, your payment has been successful. Please contact us for more information.`
          }, {
            username: user?.name || user?.username || 'there'
          })}
        </span>
      )}
      extra={[
        <Button className="secondary" key="console" onClick={() => router.push('/home')}>
          <AiOutlineHome />
          {intl.formatMessage({ id: 'backHome', defaultMessage: 'BACK HOME' })}
        </Button>,
        <Button key="buy" className="primary" onClick={() => router.push('/user/payment-history')}>
          <AiOutlineHistory />
          {intl.formatMessage({ id: 'paymentHistory', defaultMessage: 'PAYMENT HISTORY' })}
        </Button>
      ]}
    />
  );
}

export default SuccessBox;
