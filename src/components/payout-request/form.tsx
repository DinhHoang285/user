/* eslint-disable no-shadow */
/* eslint-disable no-template-curly-in-string */
import { showError } from '@lib/message';
import { shortenLargeNumber } from '@lib/number';
import {
  Alert,
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Tag
} from 'antd';
import classNames from 'classnames';
import { useRouter } from 'next/navigation';
import { useIntl } from 'react-intl';
import { IUser, PayoutRequestInterface } from 'src/interfaces';
import { useMainThemeLayout } from 'src/providers/main-layout.provider';
import style from './payout-request.module.scss';

interface Props {
  submit: Function;
  submiting: boolean;
  payout: Partial<PayoutRequestInterface>;

  user: IUser;
}

function PayoutRequestForm({
  payout, submit, submiting, user
}: Props) {
  const { settings } = useMainThemeLayout();

  const {
    requestNote, requestTokens, status, paymentAccountType
  } = payout;
  const intl = useIntl();
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return '#2db7f5';
      case 'rejected':
        return '#f50';
      case 'done':
        return '#108ee9';

      default:
        return '#108ee9';
    }
  };

  return (
    <div className={classNames(
      style['payout-request-form']
    )}
    >
      <Form
        layout="vertical"
        className="payout-request-form"
        name="payoutRequestForm"
        onFinish={(data) => {
          if (data.requestTokens < settings.minimumPayoutAmount) {
            showError(intl.formatMessage({
              id: 'minimumPayoutAmount',
              // eslint-disable-next-line no-template-curly-in-string
              defaultMessage: `Minimum payout amount is €${settings.minimumPayoutAmount}`
            }, {
              amount: settings.minimumPayoutAmount
            }));
            return;
          }
          if (data.requestTokens > user?.balance) {
            showError(intl.formatMessage({
              id: 'errorPayoutRequestedAmount',
              defaultMessage: 'Requested amount must be less than or equal your wallet balance'
            }));
            return;
          }
          submit(data);
        }}
        initialValues={{
          requestNote: requestNote || '',
          requestTokens: requestTokens || user?.balance || 0,
          paymentAccountType: paymentAccountType || 'banking'
        }}
        scrollToFirstError
      >
        <div className={classNames(
          style['payout-request-form-header']
        )}
        >
          {payout._id ? (
            <Form.Item
              label="Status"
            >
              <Tag color={getStatusColor(status)} style={{ textTransform: 'capitalize' }}>{status}</Tag>
            </Form.Item>
          )
            : (
              <div className={classNames(
                style.stas
              )}
              >
                {intl.formatMessage({ id: 'balance', defaultMessage: 'balance' })}
                :
                {' '}
                €
                {shortenLargeNumber((user?.balance || 0).toFixed(2))}
              </div>
            )}
        </div>
        <Form.Item
          label={intl.formatMessage({ id: 'requestedAmount', defaultMessage: 'Requested amount' })}
          name="requestTokens"
          extra={intl.formatMessage({
            id: 'minimumPayoutAmount',
            // eslint-disable-next-line no-template-curly-in-string
            defaultMessage: 'Minimum payout amount is €{amount}'
          }, {
            amount: settings.minimumPayoutAmount
          })}
          validateTrigger={['onChange', 'onBlur']}
          rules={[{
            required: true,
            message: `${intl.formatMessage({ id: 'addPayoutAmount', defaultMessage: 'Please add the payout amount!' })}`
          },
          {
            type: 'number',
            min: settings.minimumPayoutAmount,
            message: intl.formatMessage({
              id: 'minimumPayoutAmount',
              defaultMessage: `Minimum payout amount is €${settings.minimumPayoutAmount}`
            }, {
              amount: settings.minimumPayoutAmount
            })
          },
          {
            type: 'number',
            max: user?.balance,
            message: intl.formatMessage({
              id: 'maximumPayoutAmount',
              // eslint-disable-next-line no-template-curly-in-string
              defaultMessage: `Maximum payout amount is €${user?.balance}`
            }, {
              amount: user?.balance
            })
          }
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            disabled={payout && payout.status === 'done'}
            min={settings.minimumPayoutAmount}
            max={user?.balance}
          />
        </Form.Item>
        <Form.Item label={intl.formatMessage({ id: 'noteToAdmin', defaultMessage: 'Note to Admin' })} name="requestNote">
          <Input.TextArea disabled={payout && payout.status === 'done'} placeholder={intl.formatMessage({ id: 'textSomethingAdmin', defaultMessage: 'Text something to admin here' })} rows={3} />
        </Form.Item>
        {payout?.adminNote && (
          <Form.Item label={intl.formatMessage({ id: 'adminNote', defaultMessage: 'Admin noted' })}>
            <Alert type="info" message={payout?.adminNote} />
          </Form.Item>
        )}
        <Form.Item label={intl.formatMessage({ id: 'selectPayoutMethod', defaultMessage: 'Select payout method' })} name="paymentAccountType">
          <Select>
            <Select.Option value="banking" key="banking">
              <img src="/banking-ico.png" width="30px" alt="banking" />
              {' '}
              {intl.formatMessage({ id: 'buttonBanking', defaultMessage: 'Banking' })}
            </Select.Option>
            <Select.Option value="paypal" key="paypal">
              <img src="/paypal-ico.png" width="30px" alt="paypal" />
              {' '}
              {intl.formatMessage({ id: 'paypal', defaultMessage: 'Paypal' })}
            </Select.Option>
          </Select>
        </Form.Item>
        <div className={style['payout-request-form-footer']}>
          <Button
            className="primary"
            loading={submiting}
            htmlType="submit"
            disabled={['done', 'approved'].includes(status) || submiting}
          >
            {intl.formatMessage({ id: 'submit', defaultMessage: 'Submit' })}
          </Button>
          <Button
            className="secondary"
            loading={submiting}
            htmlType="button"
            disabled={submiting}
            onClick={() => router.back()}
          >
            {intl.formatMessage({ id: 'cancel', defaultMessage: 'Cancel' })}
          </Button>
        </div>
      </Form>
    </div>
  );
}

PayoutRequestForm.defaultProps = {};

export default PayoutRequestForm;
