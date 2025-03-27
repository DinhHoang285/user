/* eslint-disable no-shadow */

'use client';

import { IPerformer } from '@interfaces/performer';
import { showError, showSuccess } from '@lib/message';
import { tokenTransactionService } from '@services/token-transaction.service';
import { Modal } from 'antd';
import { uniqueId } from 'lodash';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useMessage } from 'src/providers/message.provider';
import style from './modal-tip.module.scss';
import { TipPerformerForm } from './tip-form';

type Props = {
  performer: IPerformer;
  open?: boolean;
  sessionId?: string;
  conversationId?: string;
  onClose?: Function;
  inPrivateChat?: boolean;
  onNewMessage?: Function
};

export function ModalTip({
  performer,
  sessionId,
  conversationId,
  open = true,
  onClose = () => { },
  inPrivateChat = false,
  onNewMessage
}: Props) {
  const intl = useIntl();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { activeConversation } = useMessage();
  const pathName = usePathname();

  const { data: session, update: updateBalance } = useSession();

  const sendTip = async (price: number, giftId: any) => {
    try {
      if (!session?.user._id) {
        showError(
          intl.formatMessage({
            id: 'pleaseLoginToDoThisAction',
            defaultMessage: 'Please login to do this action'
          })
        );
        return;
      }
      if (price <= 0) {
        showError(
          intl.formatMessage({
            id: 'chooseOrEnterTheTipAmount',
            defaultMessage: 'Choose or Enter the tip Amount from the options'
          })
        );
        return;
      }
      setLoading(true);
      if (session?.user.balance < price) {
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
      if (giftId) {
        setLoading(true);
        // eslint-disable-next-line no-nested-ternary
        const streamType = pathName.includes('/streaming/[username]') ? 'stream_public' : pathName.includes('/streaming/private') ? 'stream_private' : undefined;
        const conversationId = pathName.includes('/streaming') ? (activeConversation as any)?._id : '';
        await tokenTransactionService.sendGift(giftId, {
          performerId: performer._id, price, streamType, conversationId
        });
        showSuccess('Thank you for the gift');
        updateBalance({ info: { ...session?.user, balance: Number(session?.user.balance) - price } });

        return;
      }
      await tokenTransactionService.sendTip(performer._id, {
        price,
        conversationId,
        sessionId,
        streamType: (conversationId && !inPrivateChat) ? 'stream_public' : ''
      });
      showSuccess(
        intl.formatMessage({
          id: 'thanksYouForTheTip',
          defaultMessage: 'Thank you for the tip'
        })
      );
      if (inPrivateChat) {
        const cloneMessageTip = {
          conversationId,
          createdAt: new Date(),
          fileIds: [],
          files: false,
          isSale: false,
          price: 0,
          senderId: session?.user._id,
          text: `<span>${session?.user.name || session?.user.username}</span> Has Just sent you a <span>€${price}</span> TIP!`,
          type: 'tip',
          _id: uniqueId()
        };
        onNewMessage(cloneMessageTip);
        // messageDispatch({ type: 'UPDATE_LASTED_MESSAGE', payload: cloneMessageTip });
        // messageDispatch({ type: 'SEND_MESSAGE_SUCCESS', payload: cloneMessageTip });
      }
      updateBalance({ info: { ...session?.user, balance: Number(session?.user.balance) - Number(price) } });
    } catch (e) {
      showError(e);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  if (!open) return null;
  return (
    <Modal
      key="tip_performer"
      className={style['tip-modal']}
      open
      centered
      onOk={() => onClose()}
      footer={null}
      width={600}
      title={null}
      onCancel={() => onClose()}
      destroyOnClose
    >
      <TipPerformerForm
        performer={performer}
        submiting={loading}
        onFinish={sendTip}
      />
    </Modal>
  );
}

ModalTip.defaultProps = {
  open: false,
  sessionId: '',
  conversationId: '',
  onClose: () => { },
  inPrivateChat: false
};

export default ModalTip;
