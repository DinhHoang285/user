'use client';

import ImageWithFallback from '@components/common/images/image-fallback';
import SubscribeButtons from '@components/performer/buttons/subscribe-buttons';
import { IFeed } from '@interfaces/index';
import { showError, showSuccess } from '@lib/message';
import { tokenTransactionService } from '@services/token-transaction.service';
import { Avatar, Button, Modal } from 'antd';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AiOutlineCheck } from 'react-icons/ai';
import { useIntl } from 'react-intl';
import { useMainThemeLayout } from 'src/providers/main-layout.provider';
import style from './style.module.scss';

interface IProps {
  feed: IFeed;
  onClose: Function;
  onPaymentSuccess?: Function;
}

export default function PurchaseFeedForm({
  feed, onClose, onPaymentSuccess = () => { }
}: IProps) {
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const intl = useIntl();
  const { setLoginModal } = useMainThemeLayout();
  const { data: session, update: updateProfile } = useSession();

  return (
    <Modal
      title={null}
      width={700}
      open
      footer={null}
      onCancel={() => onClose()}
    >
      <div className={`confirm-purchase-form ${style['confirm-purchase']}`}>
        <div className="left-col">
          <Avatar src={feed?.performer?.avatar || '/no-avatar.jpg'} />
          <div className="p-name">
            <span>{feed?.performer?.name || 'N/A'}</span>
            {' '}
            {feed?.performer?.verifiedAccount && (
              <span><AiOutlineCheck className="primary-color" /></span>
            )}
          </div>
          <div className="p-username">
            <span>@</span>
            <span>{feed?.performer?.username || 'n/a'}</span>
          </div>
          <ImageWithFallback
            options={{
              className: 'lock-icon'
            }}
            src="/lock-icon.png"
            alt="lock"
          />
        </div>
        {feed.isSale ? (
          <div className="right-col">
            <h2>
              <span>
                {intl.formatMessage({
                  id: 'unblockContent',
                  defaultMessage: 'Unblock Content'
                })}
              </span>
            </h2>
            <h3>
              <span className="price">{(feed?.price || 0).toFixed(2)}</span>
              {' '}
              <span>
                {intl.formatMessage({
                  id: 'eur',
                  defaultMessage: 'EUR'
                })}
              </span>
            </h3>
            <p className="description">
              <span>{feed.text}</span>
            </p>
            <Button
              className="primary"
              disabled={submitting}
              loading={submitting}
              onClick={async () => {
                if (!session?.user?._id) {
                  setLoginModal({ openForm: 'login' });
                  return;
                }
                try {
                  setSubmitting(true);
                  if (session?.user.balance < feed.price) {
                    showError(
                      intl.formatMessage({
                        id: 'youHaveAnInsufficientWalletBalance',
                        defaultMessage:
                          'You have an insufficient wallet balance. Please top up.'
                      })
                    );
                    router.push('/wallet');
                    return;
                  }

                  const { data } = await tokenTransactionService.purchaseFeed(feed?._id, {});

                  onPaymentSuccess(data);
                  showSuccess(intl.formatMessage({ id: 'purchaseSuccess', defaultMessage: 'Purchase success' }));
                  updateProfile({ info: { ...session?.user, balance: Number(session?.user?.balance) - Number(feed.price) } });
                  onClose();
                } catch (e) {
                  showError(e);
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              <span>
                {intl.formatMessage({
                  id: 'confirmToUnblock',
                  defaultMessage: `Confirm to unlocks ${(feed?.price || 0).toFixed(2)}`
                })}
              </span>
            </Button>
          </div>
        ) : (
          <div className="right-col">
            <h2>
              <span>
                {intl.formatMessage({
                  id: 'subscribeToUnlock',
                  defaultMessage: 'Subscribe to unlock'
                })}
              </span>
            </h2>
            <SubscribeButtons performer={feed.performer} />
          </div>
        )}
      </div>
    </Modal>
  );
}
