'use client';

import Link from 'next/link';
import { useContext } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { IUser } from '@interfaces/user';
import classNames from 'classnames';
import { usePathname } from 'next/navigation';
import {
  AiFillHome, AiOutlineUser, AiOutlineBlock, AiOutlineStop, AiOutlineBank,
  AiOutlineGift, AiOutlineFire, AiOutlinePieChart, AiOutlineShoppingCart,
  AiOutlineDollar, AiOutlineLogout
} from 'react-icons/ai';
import { Divider } from 'antd';
import { SocketContext } from 'src/socket';

import { authService } from '@services/auth.service';
import style from './style.module.scss';

function PerformerDrawerMenu() {
  const { data: session } = useSession();
  const currentUser: IUser = session?.user as IUser;
  const pathname = usePathname();

  const { socket } = useContext(SocketContext);

  return (
    <div className={style['profile-menu-item']}>
      <Link href={`/${currentUser.username || currentUser._id}`}>
        <div className={classNames(style['menu-item'], {
          [style.active]: !!(pathname === `/${currentUser.username || currentUser._id}`)
        })}
        >
          <span>
            <AiFillHome size={18} />
            My Profile
          </span>
        </div>
      </Link>
      <Link href="/my-account">
        <div
          className={classNames(style['menu-item'], {
            [style.active]: !!(pathname === '/my-account')
          })}
        >
          <span>
            <AiOutlineUser size={18} />
            Edit Profile
          </span>
        </div>
      </Link>
      <Link href="/blacklist">
        <div
          className={classNames(style['menu-item'], {
            [style.active]: !!(pathname === '/creator/blacklist')
          })}
        >
          <span>
            <AiOutlineBlock size={18} />
            Blacklist
          </span>
        </div>
      </Link>
      <Link href="/block-countries">
        <div
          className={classNames(style['menu-item'], {
            [style.active]: !!(pathname === '/block-countries')
          })}
        >
          <span>
            <AiOutlineStop size={18} />
            Block Countries
          </span>
        </div>
      </Link>
      <Link href="/banking">
        <div
          className={classNames(style['menu-item'], {
            [style.active]: !!(pathname === '/banking')
          })}
        >
          <span>
            <AiOutlineBank size={18} />
            Banking (to earn)
          </span>
        </div>
      </Link>
      <Link href="/referral">
        <div
          className={classNames(style['menu-item'], {
            [style.active]: !!(pathname === '/referral')
          })}
        >
          <span>
            <AiOutlineGift size={18} />
            {' '}
            Referral
          </span>
        </div>
      </Link>
      <Divider />
      <Link href="/my-post">
        <div
          className={classNames(style['menu-item'], {
            [style.active]: !!(pathname === '/my-post')
          })}
        >
          <span>
            <AiOutlineFire size={18} />
            My Feeds
          </span>
        </div>
      </Link>
      <Divider />
      <Link href="/analytics">
        <div
          className={classNames(style['menu-item'], {
            [style.active]: !!(pathname === '/analytics')
          })}
        >
          <span>
            <AiOutlinePieChart size={18} />
            Fan Insight
          </span>
        </div>
      </Link>
      <Divider />
      <Link href={{ pathname: '/my-order' }}>
        <div
          className={classNames(style['menu-item'], {
            [style.active]: !!(pathname === '/my-order')
          })}
        >
          <span>
            <AiOutlineShoppingCart size={18} />
            Order History
          </span>
        </div>
      </Link>
      <Link href="/my-earning">
        <div
          className={classNames(style['menu-item'], {
            [style.active]: !!(pathname === '/my-earning')
          })}
        >
          <span>
            <AiOutlineDollar size={18} />
            Earning History
          </span>
        </div>
      </Link>
      <Divider />
      <div
        aria-hidden
        className={style['menu-item']}
        onClick={() => {
          const token = authService.getToken();
          authService.removeToken();
          socket && token && socket.emit('auth/logout', { token });
          signOut({ redirect: false }).then(() => {
            window.location.href = '/login';
          });
        }}
      >
        <span>
          <AiOutlineLogout size={18} />
          Sign Out
        </span>
      </div>
    </div>
  );
}

export default PerformerDrawerMenu;
