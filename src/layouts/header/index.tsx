'use client';

import withHydrationOnDemand from 'react-hydration-on-demand';
import { Event } from 'src/socket';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { userService } from '@services/user.service';
import { usePathname } from 'next/navigation';
import MiddleMenu from './middle-menu';
import style from './style.module.scss';

const MiddleMenuHydration = withHydrationOnDemand({ on: ['idle', 'visible'] })(
  MiddleMenu
);

export default function Header() {
  const pathname = usePathname();
  const { data: session, update: updateSession } = useSession();
  const [toggleUpdateUser, setToggleUpdateUser] = useState(false);

  const handleUpdateUserSession = (data: { [key: string]: number }) => {
    updateSession({
      info: { ...session.user, ...data }
    });
  };

  useEffect(() => {
    if (session?.user?._id) {
      const getMe = async () => {
        const { data } = await userService.me();
        handleUpdateUserSession(data);
      };
      getMe();
    }
  }, [toggleUpdateUser]);

  if (pathname.includes('/reels')) return null;

  return (
    <>
      <Event event="update_balance" handler={(event) => session.user.isPerformer && setToggleUpdateUser(!toggleUpdateUser)} />
      <Event event="nofify_read_messages_in_conversation" handler={(event) => setToggleUpdateUser(!toggleUpdateUser)} />
      <Event event="send_notification" handler={() => setToggleUpdateUser(!toggleUpdateUser)} />
      <Event
        event="payment_status_callback"
        handler={({ redirectUrl }) => {
          if (redirectUrl) {
            window.location.href = redirectUrl;
          }
        }}
      />
      <div id="layoutHeader" className={style['main-header']}>
        <MiddleMenuHydration />
      </div>
    </>
  );
}
