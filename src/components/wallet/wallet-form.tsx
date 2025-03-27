'use client';

import Loader from '@components/common/base/loader';
import PageHeading from '@components/common/page-heading';

import { showError, showSuccess } from '@lib/message';
import { walletAmount } from '@lib/validation';
import { paymentService } from '@services/payment.service';
import {
  Alert, Button, Form, Input, InputNumber
} from 'antd';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useMainThemeLayout } from 'src/providers/main-layout.provider';
import { AiOutlineArrowLeft, AiOutlineWallet } from 'react-icons/ai';
import style from './wallet.module.scss';

export default function WalletForm() {
  const intl = useIntl();
  const { data: session } = useSession();
  const { settings } = useMainThemeLayout();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [coupon, setCoupon] = useState(null);
  const [amount, setAmount] = useState(10);

  const { minimumWalletPrice = 0, maximumWalletPrice = 100 } = settings;

  return (
    <div className="wallet-form-container">
      <PageHeading
        title={intl.formatMessage({ id: 'wallet', defaultMessage: 'Wallet' })}
        icon={<AiOutlineArrowLeft />}
      />
      <div className={style['purchase-form']}>
        <div className={style['current-balance']}>
          <AiOutlineWallet />
          <div className={style.balance}>
            <b>
              <span>
                {intl.formatMessage({ id: 'currentBalance', defaultMessage: 'Current Balance' })}
              </span>
            </b>
            <span className={style.amount}>
              €
              {(session?.user.balance || 0).toFixed(2)}
            </span>
          </div>
        </div>
        <Alert
          type="warning"
          style={{ maxWidth: '100%', width: 550, margin: '10px auto' }}
          message={intl.formatMessage({
            id: 'walletAlert',
            defaultMessage:
              'Wallet Balances can be used as a convenient method to send tips to your favorite performers as well as digital content. Once your wallet balance depletes you can simply top off your wallet account to continue enjoying the benefits.'
          })}
        />
        <Form
          form={form}
          onFinish={async ({ cardId, amount: value }) => {
            if (value < minimumWalletPrice || value > maximumWalletPrice) {
              showError(
                intl.formatMessage(
                  {
                    id: 'amountError',
                    defaultMessage:
                      `Minimum amount must be ${minimumWalletPrice} and maximum amount must be ${maximumWalletPrice}`
                  },
                  { min: minimumWalletPrice, max: maximumWalletPrice }
                )
              );
              return;
            }
            try {
              setSubmitting(true);
              await paymentService.addFunds({
                paymentGateway: 'segpay',
                amount: value,
                cardId: cardId || '',
                couponCode: coupon ? couponCode : ''
              });
            } catch (e) {
              showError(e);
              setSubmitting(false);
            }
          }}
          onFinishFailed={() => showError(
            intl.formatMessage({
              id: 'PleaseCompleteTheRequiredFields',
              defaultMessage: 'Please complete the required fields'
            })
          )}
          name="form-upload"
          scrollToFirstError
          initialValues={{ amount }}
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
        >
          <Form.Item
            name="amount"
            label={intl.formatMessage({ id: 'enterAmount', defaultMessage: 'Enter Amount' })}
            rules={walletAmount}
            validateTrigger={['onChange', 'onBlur']}
            extra={(
              <>
                <p className="black-color" style={{ fontSize: 11 }}>
                  <span>
                    {intl.formatMessage({
                      id: 'minimumTopUpWalletAmount€',
                      defaultMessage: `Minimum top up wallet amount € ${minimumWalletPrice}`
                    }, { price: `${minimumWalletPrice}` })}
                  </span>
                </p>
                <p className="black-color" style={{ fontSize: 11 }}>
                  <span>
                    {intl.formatMessage({
                      id: 'maximumTopUpWalletAmount',
                      defaultMessage: `Maximum top up wallet amount € ${maximumWalletPrice}`
                    }, { price: `${maximumWalletPrice}` })}
                  </span>
                </p>
              </>
            )}
          >
            <InputNumber
              type="number"
              onChange={(val) => setAmount(val)}
              step={1}
              style={{ width: '100%' }}
              min={0}
              max={maximumWalletPrice}
            />
          </Form.Item>
          <Form.Item help={
            coupon && (
              <small style={{ color: 'red' }}>
                <span>
                  {intl.formatMessage({ id: 'discount', defaultMessage: 'Discount' })}
                  {' '}
                  {coupon.value * 100}
                  %
                </span>
              </small>
            )
          }
          >
            <Button.Group className={style['coupon-dc']}>
              <Input
                disabled={!!coupon}
                placeholder={intl.formatMessage({ id: 'enterCouponCodeHere', defaultMessage: 'Enter coupon code here' })}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              {!coupon ? (
                <Button
                  disabled={!couponCode}
                  onClick={async () => {
                    try {
                      const resp = await paymentService.applyCoupon(couponCode);
                      setCoupon(resp.data);
                      showSuccess(
                        intl.formatMessage({ id: 'couponApplied', defaultMessage: 'Coupon is applied' })
                      );
                    } catch (e) {
                      showError(e);
                    }
                  }}
                >
                  <span>{intl.formatMessage({ id: 'apply', defaultMessage: 'Apply!' })}</span>
                </Button>
              ) : (
                <Button
                  type="primary"
                  onClick={() => {
                    setCoupon(null);
                    setCouponCode('');
                  }}
                >
                  <span>{intl.formatMessage({ id: 'useLater', defaultMessage: 'Use Later!' })}</span>
                </Button>
              )}
            </Button.Group>
          </Form.Item>
          <Form.Item className={style['total-price']}>
            <span>{intl.formatMessage({ id: 'total', defaultMessage: 'Total:' })}</span>
            <span className={style.amount}>
              €
              {(amount - amount * (coupon?.value || 0)).toFixed(2)}
            </span>
          </Form.Item>
          <Form.Item className="text-center">
            <Button htmlType="submit" className="primary" disabled={submitting} loading={submitting}>
              <span>{intl.formatMessage({ id: 'buyNow', defaultMessage: 'BUY NOW' })}</span>
            </Button>
          </Form.Item>
        </Form>
      </div>
      {submitting && (
        <Loader
          active={submitting}
          customText={intl.formatMessage({
            id: 'walletUpdateTime',
            defaultMessage: 'The amount will be added to the wallet 15 seconds to 1 min.'
          })}
        />
      )}
    </div>
  );
}
