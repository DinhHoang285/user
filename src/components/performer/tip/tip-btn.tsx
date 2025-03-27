/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import { IPerformer } from '@interfaces/performer';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { TbCurrencyDollar } from 'react-icons/tb';
import { useIntl } from 'react-intl';
import { useSession } from 'next-auth/react';
import { useMainThemeLayout } from 'src/providers/main-layout.provider';
import style from './tip-btn.module.scss';

const ModalTip = dynamic(() => import('./modal-tip'), { ssr: false });

type Props = {
  performer: IPerformer;
  sessionId?: string;
  conversationId?: string;
  hideText?: boolean;
  classes?: string;
  inPrivateChat?: boolean;
  inContentView?: boolean;
  colorIcon?: string;
  onNewMessage?: Function
};

export default function TipPerformerButton({
  performer,
  onNewMessage,
  hideText = false,
  classes = '',
  sessionId = '',
  conversationId = '',
  inPrivateChat = false,
  inContentView = false,
  colorIcon = null
}: Props) {
  const [openModal, setOpenModal] = useState(false);
  const { data: session } = useSession();
  const user: IPerformer = session?.user as IPerformer;
  const intl = useIntl();
  const { setLoginModal, setAutoPlayVideo } = useMainThemeLayout();

  const handleClick = () => {
    setAutoPlayVideo({ autoPlayBtn: 'off' });

    if (!user?._id) {
      setLoginModal({ openForm: 'login' });
    } else {
      setOpenModal(true);
    }
  };

  return (
    <>
      <button
        type="button"
        disabled={user?.isPerformer}
        className={`
        ${style['tip-btn']}
        ${style['action-btn']}
        ${classes}
        ${inContentView ? style.inContentView : ''}
        ${user?.isPerformer ? 'disabled-btn' : ''}`}
        onClick={handleClick}
      >
        <span className="icon">
          <TbCurrencyDollar
            style={{
              color: colorIcon,
              transform: inPrivateChat ? 'translateY(10%)' : undefined,
              display: 'flex',
              alignItems: 'center'
            }}
          />
        </span>
        {!hideText && (
          <span className={style.txt}>
            {intl.formatMessage({
              id: 'sendTip',
              defaultMessage: 'Send Tip'
            })}
          </span>
        )}
      </button>
      {openModal && (
        <ModalTip
          onClose={() => setOpenModal(false)}
          performer={performer}
          open={openModal}
          sessionId={sessionId}
          conversationId={conversationId}
          inPrivateChat={inPrivateChat}
          onNewMessage={onNewMessage}
        />
      )}
    </>
  );
}
