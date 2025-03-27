'use client';

import Link from 'next/link';
import classNames from 'classnames';
import { usePathname } from 'next/navigation';
import { Badge } from 'antd';
import {
  AiFillHome, AiOutlineFire, AiOutlineMessage, AiOutlineSearch, AiOutlineUser, AiOutlineAudio
} from 'react-icons/ai';
import { PiFilmReelLight } from 'react-icons/pi';
import { useSession } from 'next-auth/react';
import { IUser } from '@interfaces/user';
import Image from 'next/image';
import style from '../middle-menu.module.scss';

type IProps = {
  openDrawer: Function;
}

function UserHeaderMenu({ openDrawer }: IProps) {
  const { data: session } = useSession();
  const currentUser = session?.user as IUser;

  const pathname = usePathname();
  return (
    <ul className={style['nav-icons']}>
      <li className={classNames({ [style.active]: pathname === '/feed' })}>
        <Link href="/feed">
          <span>
            <AiFillHome style={{ fontSize: '25px', display: 'flex', alignItems: 'center' }} />
          </span>
        </Link>
      </li>
      <li className={classNames({ [style.active]: pathname === '/home' })}>
        <Link href="/home">
          <span>
            <AiOutlineAudio style={{ fontSize: '25px', display: 'flex', alignItems: 'center' }} />
          </span>
        </Link>
      </li>
      <li className={classNames({ [style.active]: pathname === '/explore' })}>
        <Link href="/explore">
          <span>
            <AiOutlineSearch style={{ fontSize: '25px', display: 'flex', alignItems: 'center' }} />
          </span>
        </Link>
      </li>
      <li className={classNames({ [style.active]: pathname === '/creator' })}>
        <Link href="/creator">
          <span>
            <AiOutlineUser style={{ fontSize: '25px', display: 'flex', alignItems: 'center' }} />
          </span>
        </Link>
      </li>
      <li className={classNames({ [style.active]: pathname === '/trending' })}>
        <Link href="/trending">
          <span>
            <AiOutlineFire style={{ fontSize: '25px', display: 'flex', alignItems: 'center' }} />
          </span>
        </Link>
      </li>
      <li className={classNames({ [style.active]: pathname === '/reels' })}>
        <Link href="/reels">
          <span>
            <PiFilmReelLight style={{ fontSize: '25px', display: 'flex', alignItems: 'center' }} />
          </span>
        </Link>
      </li>
      <li className={classNames({ [style.active]: pathname === '/messages' })}>
        <Link href="/messages">
          <span>
            <AiOutlineMessage style={{ fontSize: '25px', display: 'flex', alignItems: 'center' }} />
            <Badge
              className={style.bagde}
              count={currentUser?.unreadMessage || 0}
              showZero
            />
          </span>
        </Link>
      </li>
      <li className={style['menu-profile']} onClick={openDrawer.bind(this)} aria-hidden>
        <span>
          <Image
            style={{ borderRadius: '50%', objectFit: 'cover' }}
            src={currentUser?.avatar || '/no-avatar.jpg'}
            alt={currentUser?.avatar || currentUser?.username}
            width={30}
            height={30}
          />
        </span>
      </li>
    </ul>
  );
}

export default UserHeaderMenu;
