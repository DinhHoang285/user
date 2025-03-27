'use client';

import { AiOutlineCheckSquare, AiOutlineCheck } from 'react-icons/ai';
import Loader from '@components/common/base/loader';
import { showError } from '@lib/message';
import { paymentService } from '@services/payment.service';
import { Avatar, Modal } from 'antd';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { IUser } from 'src/interfaces';
import { useMainThemeLayout } from 'src/providers/main-layout.provider';
import { SocketContext } from 'src/socket';

export default function SubscriptionModal() {
  const intl = useIntl();
  const { subcriptionModal, setSubscriptionModal } = useMainThemeLayout();
  const { performer, open, subscriptionType } = subcriptionModal;
  const { data: session } = useSession();
  const user: IUser = session?.user as IUser;
  const [submiting, setSubmiting] = useState(false);
  const { socket } = useContext(SocketContext);
  const router = useRouter();
  const pathname = usePathname();

  const onClose = () => setSubscriptionModal({ open: false, performer: null, subscriptionType: 'monthly' });

  const subscribe = async () => {
    if (!user._id) {
      showError(
        intl.formatMessage({ id: 'pleaseLogIn', defaultMessage: 'Please log in!' })
      );
      onClose();
      router.push('/login');
      return;
    }

    try {
      setSubmiting(true);
      const { data: resp } = await paymentService.subscribePerformer({
        type: subscriptionType || 'monthly',
        performerId: performer._id,
        paymentGateway: 'segpay',
        cardId: '' // todo - remove?
      });

      if (subscriptionType !== 'free' && resp?.paymentUrl) {
        window.open(resp?.paymentUrl, '_blank');
      }
    } catch (e) {
      showError(e);
    } finally {
      setSubmiting(false);
    }
  };

  useEffect(() => {
    onClose();
  }, [pathname, socket]);

  if (!performer) return null;

  return (
    <>
      <Modal
        key="subscribe_performer"
        className="subscription-modal"
        width={600}
        centered
        maskClosable={false}
        title={null}
        open={open}
        footer={null}
        onCancel={() => onClose()}
      >
        <div className="confirm-purchase-form">
          <div className="left-col">
            <Avatar src={performer.avatar || '/no-avatar.jpg'} />
            <div className="p-name">
              <span>{performer.name || 'N/A'}</span>
              {' '}
              {performer.verifiedAccount && <span><AiOutlineCheck /></span>}
            </div>
            <div className="p-username">
              <span>
                @
                {performer.username || 'n/a'}
              </span>
            </div>
          </div>
          <div className="right-col">
            <h2>
              <span>
                {intl.formatMessage({ id: 'subscribe', defaultMessage: 'Subscribe' })}
              </span>
              {' '}
              <span className="username">{`@${performer.username}` || 'the creator'}</span>
            </h2>
            {subscriptionType === 'monthly' && performer.enabledMonthlyDiscount && (
              <h3>
                {performer.monthlyDiscount > 0 ? (
                  <span className="price">
                    {(performer.monthlyPrice - (performer.monthlyPrice * performer.monthlyDiscount)).toFixed(2)}
                  </span>
                ) : (
                  <span className="price">{(performer.monthlyPrice || 0).toFixed(2)}</span>
                )}
                {' '}
                <span>
                  {intl.formatMessage({ id: 'EUR/month', defaultMessage: 'EUR/month' })}
                </span>
              </h3>
            )}
            {subscriptionType === 'quarterly' && performer.enabledQuarterlyDiscount && (
              <h3>
                {performer.quarterlyDiscount > 0 ? (
                  <span className="price">
                    {(performer.quarterlyPrice - (performer.quarterlyPrice * performer.quarterlyDiscount)).toFixed(2)}
                  </span>
                ) : (
                  <span className="price">{(performer.quarterlyPrice || 0).toFixed(2)}</span>
                )}
                {' '}
                <span>
                  {intl.formatMessage({ id: 'eurQuarterly', defaultMessage: 'EUR/Quarterly' })}
                </span>
              </h3>
            )}
            {subscriptionType === 'half_yearly' && performer.enabledHalfYearlyDiscount && (
              <h3>
                {performer.halfYearlyDiscount > 0 ? (
                  <span className="price">
                    {(performer.halfYearlyPrice - (performer.halfYearlyPrice * performer.halfYearlyDiscount)).toFixed(2)}
                  </span>
                ) : (
                  <span className="price">{(performer.halfYearlyPrice || 0).toFixed(2)}</span>
                )}
                {' '}
                <span>
                  {intl.formatMessage({ id: 'eurHalfYearly', defaultMessage: 'EUR/Half-yearly' })}
                </span>
              </h3>
            )}
            {subscriptionType === 'yearly' && performer.enabledYearlyDiscount && (
              <h3>
                {performer.yearlyDiscount > 0 ? (
                  <span className="price">
                    {(performer.yearlyPrice - (performer.yearlyPrice * performer.yearlyDiscount)).toFixed(2)}
                  </span>
                ) : (
                  <span className="price">{(performer.yearlyPrice || 0).toFixed(2)}</span>
                )}
                {' '}
                <span>
                  {intl.formatMessage({ id: 'eurYearly', defaultMessage: 'EUR/year' })}
                </span>
              </h3>
            )}
            {subscriptionType === 'free' && (
              <h3>
                <span className="price">
                  {intl.formatMessage({ id: 'free', defaultMessage: 'FREE' })}
                </span>
                {' '}
                <span>
                  {intl.formatMessage({ id: 'for', defaultMessage: 'for' })}
                </span>
                {' '}
                <span>{performer.durationFreeSubscriptionDays}</span>
                {' '}
                <span>
                  {intl.formatMessage({ id: 'day', defaultMessage: 'day' })}
                  {performer.durationFreeSubscriptionDays > 1 ? intl.formatMessage({ id: 'plural', defaultMessage: 's' }) : ''}
                </span>
              </h3>
            )}
            <ul className="check-list">
              <li>
                <span><AiOutlineCheckSquare /></span>
                {' '}
                <span>
                  {intl.formatMessage({
                    id: 'fullAccessExclusive',
                    defaultMessage: 'Full access to this creator\'s exclusive content'
                  })}
                </span>
              </li>
              <li>
                <span><AiOutlineCheckSquare /></span>
                {' '}
                <span>
                  {intl.formatMessage({
                    id: 'directMessageWithThisCreator',
                    defaultMessage: 'Direct message with this creator'
                  })}
                </span>
              </li>
              <li>
                <span><AiOutlineCheckSquare /></span>
                {' '}
                <span>
                  {intl.formatMessage({
                    id: 'requestedPersonalitedPayPerViewContent',
                    defaultMessage: 'Requested personalised Pay Per View content'
                  })}
                </span>
              </li>
              <li>
                <span><AiOutlineCheckSquare /></span>
                {' '}
                <span>
                  {intl.formatMessage({
                    id: 'cancelYourSubscriptionAtAnyTime',
                    defaultMessage: 'Cancel your subscription at any time'
                  })}
                </span>
              </li>
            </ul>
            <button
              type="button"
              className="primary"
              disabled={submiting}
              onClick={() => subscribe()}
              style={{
                backgroundColor: '#f06',
                color: '#fff',
                boxShadow: '0 5px 10px #32323233',
                padding: '0.7em 2em',
                fontSize: '.9em',
                fontWeight: '600',
                borderRadius: '25px',
                minHeight: '40px',
                border: '0',
                height: 'auto',
                width: '100%'
              }}
            >
              <span>
                {submiting
                  ? intl.formatMessage({ id: 'pleaseWait', defaultMessage: 'Please wait...' })
                  : intl.formatMessage({ id: 'subscribe', defaultMessage: 'Subscribe' })}
              </span>
            </button>
            <p className="sub-text">
              <span>
                {intl.formatMessage({
                  id: 'subscribeClickNote',
                  defaultMessage: 'Clicking "Subscribe" will take you to the payment screen to finalize your subscription'
                })}
              </span>
            </p>
          </div>
        </div>
      </Modal>
      {submiting && (
        <Loader
          active={submiting}
          customText={intl.formatMessage({
            id: 'paymentProcessing',
            defaultMessage: 'Your payment is processing, it might take 15 seconds to 1 min.'
          })}
        />
      )}
    </>
  );
}
