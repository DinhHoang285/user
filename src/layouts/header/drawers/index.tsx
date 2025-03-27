'use client';

import { shortenLargeNumber } from '@lib/number';
import { Drawer } from 'antd';
import { AiOutlineCheck } from 'react-icons/ai';
import { useSession } from 'next-auth/react';
import { IUser } from '@interfaces/user';
import Image from 'next/image';
import style from './style.module.scss';
import UserDrawerHeader from './drawer-header/user.drawer-header';
import PerformerDrawerHeader from './drawer-header/performer.drawer-header';
import PerformerDrawerMenu from './performer.menu';
import UserDrawerMenu from './user.menu';

type IProps = {
  open: boolean;
  onClose: Function;
}

function DrawerMenu({
  open = false, onClose
}: IProps) {
  const { data: session } = useSession();
  const currentUser: IUser = session?.user as IUser;

  return (
    <Drawer
      // closable
      onClose={() => onClose()}
      open={open}
      key="profile-drawer"
      className={style['profile-drawer']}
      width={300}
      title={(
        <>
          <div className={style['profile-user']}>
            <Image
              style={{ borderRadius: '50%', objectFit: 'cover' }}
              src={currentUser?.avatar || '/no-avatar.jpg'}
              alt={currentUser?.avatar || currentUser?.username}
              width={40}
              height={40}
            />
            <span className={style['profile-name']}>
              <span>
                {currentUser?.name || 'N/A'}
                &nbsp;
                <AiOutlineCheck size={12} />
              </span>
              <span className={style['sub-name']}>
                @
                {currentUser?.username || 'n/a'}
              </span>
            </span>
          </div>
          <div className={style['sub-info']}>
            {!currentUser?.isPerformer && (
              <UserDrawerHeader
                balance={currentUser?.balance || 0}
                totalSubscription={shortenLargeNumber(currentUser?.stats?.totalSubscriptions || 0)}
              />
            )}
            {currentUser?.isPerformer && (
              <PerformerDrawerHeader
                balance={currentUser?.balance || 0}
                totalSubscriber={shortenLargeNumber(currentUser?.stats?.subscribers || 0)}
              />
            )}
          </div>
        </>
      )}
    >
      {currentUser?.isPerformer && (
        <PerformerDrawerMenu />
      )}

      {!currentUser?.isPerformer && (
        <UserDrawerMenu />
      )}
    </Drawer>
  );
}

export default DrawerMenu;
