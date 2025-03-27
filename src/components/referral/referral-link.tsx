import {
  Button, Form, Input
} from 'antd';
import { useIntl } from 'react-intl';
import { copyToClipboard } from '@lib/action';
import style from './referral-link.module.scss';

interface IProps {
  linkReferral: string;
  referralCode: string;
  loading: boolean;
}

export default function ReferralLink({
  linkReferral, referralCode, loading
}: IProps) {
  const intl = useIntl();

  return (
    <Form className={style['referral-link']}>
      <Form.Item>
        <div className={style['referral-code']}>
          <Input value={linkReferral} />
          <Button
            className="primary"
            disabled={loading || !linkReferral}
            onClick={() => copyToClipboard(linkReferral)}
          >
            {intl.formatMessage({ id: 'copyLink', defaultMessage: 'COPY LINK' })}
          </Button>
        </div>
      </Form.Item>
      <Form.Item>
        <div className={style['referral-code']}>
          <Input value={referralCode} />
          <Button
            className="primary"
            disabled={loading || !referralCode}
            onClick={() => copyToClipboard(referralCode)}
          >
            {intl.formatMessage({ id: 'copyCode', defaultMessage: 'COPY CODE' })}
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
}
