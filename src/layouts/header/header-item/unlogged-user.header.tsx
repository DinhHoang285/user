'use client';

import Link from 'next/link';
import classNames from 'classnames';
import { usePathname } from 'next/navigation';
import {
  AiFillHome, AiOutlineFire, AiOutlineSearch, AiOutlineUser
} from 'react-icons/ai';
import { PiFilmReelLight } from 'react-icons/pi';
import style from '../middle-menu.module.scss';

function UnloggedInUserHeaderMenu() {
  const pathname = usePathname();
  return (
    <ul className={style['nav-icons']}>
      <li className={style['logo-no-account']}>
        <img src="/logo.png" alt="/logo.png" />
      </li>
      <li className={classNames({ [style.active]: pathname === '/home' })}>
        <Link href="/home">
          <span>
            <AiFillHome size={25} />
          </span>
        </Link>
      </li>
      <li className={classNames({ [style.active]: pathname === '/explore' })}>
        <Link href="/explore">
          <span>
            <AiOutlineSearch size={25} />
          </span>
        </Link>
      </li>
      <li className={classNames({ [style.active]: pathname === '/creator' })}>
        <Link href="/creator">
          <span>
            <AiOutlineUser size={25} />
          </span>
        </Link>
      </li>
      <li className={classNames({ [style.active]: pathname === '/trending' })}>
        <Link href="/trending">
          <span>
            <AiOutlineFire size={25} />
          </span>
        </Link>
      </li>
      <li className={classNames({ [style.active]: pathname === '/reels' })}>
        <Link href="/reels">
          <span>
            <PiFilmReelLight size={25} />
          </span>
        </Link>
      </li>
      <li className={style.auth_btn}>
        <Link href="/register" className={style['button-register']}>
          <span>Register</span>
        </Link>
        <Link href="/login" className={style['button-login']}>
          <span>Log In</span>
        </Link>
      </li>
    </ul>
  );
}

export default UnloggedInUserHeaderMenu;
