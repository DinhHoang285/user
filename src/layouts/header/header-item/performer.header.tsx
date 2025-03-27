'use client';

import Link from 'next/link';
import classNames from 'classnames';
import { usePathname } from 'next/navigation';
import { Badge, Dropdown } from 'antd';
import {
  AiFillHome, AiOutlineMessage, AiOutlinePlusSquare, AiOutlineBell
} from 'react-icons/ai';
import { PiFilmReelLight } from 'react-icons/pi';
import { useSession } from 'next-auth/react';
import { IUser } from '@interfaces/user';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import style from '../middle-menu.module.scss';

const NotificationHeaderMenu = dynamic(() => import('@components/notification/NotificationHeaderMenu'), { ssr: false });

type IProps = {
  openDrawer: Function;
}

function PerformerHeaderMenu({ openDrawer }: IProps) {
  const { data: session } = useSession();
  const currentUser: IUser = session?.user as IUser;
  const pathname = usePathname();

  const items = [
    { key: '1', label: <NotificationHeaderMenu /> }
  ];

  return (
    <ul className={style['nav-icons']}>
      <li className={classNames({ [style.active]: !!(pathname === '/feed') })}>
        <Link href="/feed">
          <span>
            <AiFillHome size={25} />
          </span>
        </Link>
      </li>
      <li className={classNames({ [style.active]: !!(pathname === '/my-post/create') })}>
        <Link href="/my-post/create">
          <span>
            <AiOutlinePlusSquare size={25} />
          </span>
        </Link>
      </li>
      <li className={classNames({ [style.active]: !!(pathname === '/reels') })}>
        <Link href="/reels">
          <span>
            <PiFilmReelLight size={25} />
          </span>
        </Link>
      </li>
      <li className={classNames({ [style.active]: !!(pathname === '/messages') })}>
        <Link href="/messages">
          <span>
            <AiOutlineMessage size={25} />
            <Badge
              className={style.bagde}
              count={currentUser?.unreadMessage || 0}
              showZero
            />
          </span>
        </Link>
      </li>

      <li key="notification" className={classNames({ [style.active]: !!(pathname === '/notification') })}>
        <Dropdown
          menu={{ items }}
          forceRender
          placement="bottom"
          trigger={['click']}
        >
          <a href="#" aria-label="notification">
            <span>
              <AiOutlineBell size={25} />
              <Badge
                className={style.bagde}
                count={currentUser?.unreadNotification || 0}
                showZero
              />
            </span>
          </a>
        </Dropdown>
      </li>
      <li
        aria-hidden
        onClick={openDrawer.bind(this)}
        className={style['menu-profile']}
      >
        <Image
          style={{ borderRadius: '50%', objectFit: 'cover' }}
          src={currentUser?.avatar || '/no-avatar.jpg'}
          alt={currentUser?.avatar || currentUser?.username}
          width={30}
          height={30}
        />
      </li>
    </ul>
  );
}

export default PerformerHeaderMenu;
