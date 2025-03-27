'use client';

import { IUser } from '@interfaces/user';
import classNames from 'classnames';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import style from './middle-menu.module.scss';
import UnloggedInUserMenu from './header-item/unlogged-user.header';
import PerformerHeaderMenu from './header-item/performer.header';
import UserHeaderMenu from './header-item/user.header';

const DrawerMenu = dynamic(() => import('./drawers'), { ssr: false });

function MiddleMenu() {
  const { data: session } = useSession();
  const currentUser: IUser = session?.user as IUser;
  const [open, setOpenDrawer] = useState<boolean>(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpenDrawer(false);
  }, [pathname]);

  return (
    <div className={classNames(style['nav-bar'])}>
      {/* unlogged in user */}
      {!currentUser?._id && <UnloggedInUserMenu />}

      {/* performer */}
      {currentUser?._id && currentUser?.isPerformer && <PerformerHeaderMenu openDrawer={() => setOpenDrawer(true)} />}

      {/* user */}
      {currentUser?._id && !currentUser?.isPerformer && <UserHeaderMenu openDrawer={() => setOpenDrawer(true)} />}

      <DrawerMenu open={open} onClose={() => setOpenDrawer(false)} />
    </div>
  );
}

export default MiddleMenu;
