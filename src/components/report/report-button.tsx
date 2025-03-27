'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { IFeed } from '@interfaces/feed';
import { AiOutlineFlag } from 'react-icons/ai';
import { useMainThemeLayout } from 'src/providers/main-layout.provider';

const ReportForm = dynamic(() => import('@components/report/report-form'));

export default function ReportButton({ feed }: { feed: IFeed }) {
  const [isOpen, setOpen] = useState(false);
  const { setLoginModal } = useMainThemeLayout();
  const { data } = useSession();
  return (
    <>
      <button
        aria-hidden
        className="denuncia"
        type="button"
        onClick={() => {
          if (!data?.user?._id) {
            setLoginModal({ openForm: 'login' });
            return;
          }
          setOpen(true);
        }}
      >
        <span>
          <AiOutlineFlag />
        </span>
      </button>
      {isOpen && (
        <ReportForm
          target="feed"
          targetId={feed._id}
          performer={feed.performer}
          onClose={() => setOpen(false)}
          open={isOpen}
        />
      )}
    </>
  );
}
