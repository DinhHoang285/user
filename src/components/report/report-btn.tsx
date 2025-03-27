'use client';

/* eslint-disable react/require-default-props */
import { IPerformer } from '@interfaces/performer';
import { Tooltip } from 'antd';
import { useState } from 'react';
import { AiOutlineFlag } from 'react-icons/ai';

import { IUser } from '@interfaces/user';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useIntl } from 'react-intl';
import { useMainThemeLayout } from 'src/providers/main-layout.provider';
import style from './report-btn.module.scss';

const ReportForm = dynamic(() => (import('./report-form')), { ssr: false });

type IProps = {
  performer: IPerformer;
  target: string;
  targetId: string;
}

function ReportBtn({
  target,
  targetId,
  performer = null
}: IProps) {
  const { data: session } = useSession();
  const user: IUser = session?.user as IUser;

  const [openModal, setOpenModal] = useState(false);
  const intl = useIntl();
  const { setAutoPlayVideo } = useMainThemeLayout();

  return (
    <>
      <button
        type="button"
        disabled={!user?._id || user?.isPerformer}
        className={`
          ${style['action-ico']}
          ${style['action-btn']}
          ${openModal ? style.active : null}
          ${!user?._id || user?.isPerformer ? 'disabled-btn' : null}
          `}
        onClick={() => {
          setAutoPlayVideo({ autoPlayBtn: 'off' });
          setOpenModal(true);
        }}
      >
        <Tooltip title={intl.formatMessage({
          id: 'report',
          defaultMessage: 'Report'
        })}
        >
          <span>
            <AiOutlineFlag />
          </span>
        </Tooltip>
      </button>
      {
        openModal
        && (
          <ReportForm
            performer={performer}
            onClose={() => setOpenModal(false)}
            target={target}
            open={openModal}
            targetId={targetId}
          />
        )
      }
    </>
  );
}

export default ReportBtn;
