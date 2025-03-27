/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import { IFeed, IUser, IVideo } from '@interfaces/index';
import { showError } from '@lib/message';
import { tokenTransactionService } from '@services/token-transaction.service';
import {
  Avatar, Button, Modal
} from 'antd';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { AiOutlineCheck } from 'react-icons/ai';
import ImageWithFallback from '@components/common/images/image-fallback';

const SubscribeButtons = dynamic(
  () => import('@components/performer/buttons/subscribe-buttons')
);

interface IProps {
  reels: IFeed;
  open: boolean;
  onClose: Function;
  onPurchaseSucess: () => any;
  onSubcribeSuccess: () => any
}

export default function PurchaseReelsForm(props: IProps) {
  const {
    reels,
    open,
    onClose,
    onPurchaseSucess = () => { },
    onSubcribeSuccess = () => { }
  } = props;
  if (!open) return null;
  const intl = useIntl();
  const [submiting, setSubmiting] = useState(false);
  const { data: session, update: updateBalance } = useSession();
  const user: IUser = session?.user as any;
  const router = useRouter();

  if (!open) return null;

  return (
    <Modal
      key="purchase_feed"
      width={700}
      centered
      maskClosable={false}
      title={null}
      open={open}
      footer={null}
      onCancel={() => onClose()}
    >
      <div className="confirm-purchase-form">
        <div className="left-col">
          <Avatar src={reels?.performer?.avatar || '/no-avatar.jpg'} />
          <div className="p-name">
            <span>
              {reels?.performer?.name || 'N/A'}
              {' '}
              {reels?.performer?.verifiedAccount && (
                <AiOutlineCheck className="primary-color" />
              )}
            </span>
          </div>
          <div className="p-username">
            @
            {reels?.performer?.username || 'n/a'}
          </div>
          <ImageWithFallback
            options={{
              unoptimized: true,
              className: 'lock-icon'
            }}
            src="/lock-icon.png"
            alt="lock"
          />
        </div>
        {reels.isSale ? (
          <div className="right-col">
            <h2>
              {intl.formatMessage({
                id: 'unblockContent',
                defaultMessage: 'Unblock Content'
              })}
            </h2>
            <h3>
              <span className="price">{(reels?.price || 0).toFixed(2)}</span>
              {' '}
              {intl.formatMessage({
                id: 'eur',
                defaultMessage: 'EUR'
              })}
            </h3>
            <p className="description">{reels.title}</p>
            <Button
              className="primary"
              disabled={submiting}
              loading={submiting}
              onClick={async () => {
                try {
                  setSubmiting(true);
                  if (user.balance < reels.price) {
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
                  await tokenTransactionService.purchaseFeed(reels._id, {});
                  updateBalance({ info: { ...session?.user, balance: Number(session?.user.balance) - Number(reels.price) } });
                  onPurchaseSucess();
                } catch (e) {
                  showError(e);
                } finally {
                  setSubmiting(false);
                }
              }}
            >
              {
                submiting
                  ? intl.formatMessage({
                    id: 'pleaseWait',
                    defaultMessage: 'Please wait...'
                  })
                  : intl.formatMessage({
                    id: 'confirmToUnblock',
                    defaultMessage: 'Confirm to unlock'
                  })
              }
            </Button>
          </div>
        ) : (
          <div className="right-col">
            <h2>
              {intl.formatMessage({
                id: 'subscribeToUnlock',
                defaultMessage: 'Subscribe to unlock'
              })}
            </h2>
            <SubscribeButtons
              performer={reels.performer}
              onClickSubcription={() => onClose()}
            />
          </div>
        )}
      </div>
    </Modal>
  );
}
