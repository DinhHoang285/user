'use client';

import { IPerformer } from '@interfaces/performer';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useMainThemeLayout } from 'src/providers/main-layout.provider';
import style from './live-button.module.scss';

interface P {
  performer: IPerformer;
}

export default function LiveButton({ performer }: P) {
  const { data: session } = useSession();
  const { setLoginModal } = useMainThemeLayout();
  const router = useRouter();

  return (
    <>
      <span className={performer.isOnline > 0 ? style['online-status'] : `${style['online-status']} ${style.off}`} />
      {performer.live > 0 && (
        <button
          type="button"
          onClick={() => {
            if (!session?.user?._id) {
              setLoginModal({ openForm: 'login' });
              return;
            }
            if (session?.user?.isPerformer) return;
            router.push(`/streaming/${performer.username}`);
          }}
          className={style['live-status']}
        >
          <i />
          {' '}
          Live
        </button>
      )}
    </>

  );
}
