import Link from 'next/link';
import { useContext } from 'react';
import { signOut } from 'next-auth/react';
import classNames from 'classnames';
import { usePathname } from 'next/navigation';
import {
  AiOutlineUser, AiOutlineBook, AiOutlineHeart, AiOutlineDollar,
  AiOutlineShoppingCart, AiOutlineHistory, AiOutlineLogout
} from 'react-icons/ai';
import { Divider } from 'antd';
import { SocketContext } from 'src/socket';

import { authService } from '@services/auth.service';
import style from './style.module.scss';

function UserDrawerMenu() {
  const pathname = usePathname();

  const { socket } = useContext(SocketContext);

  return (
    <div className={style['profile-menu-item']}>
      <Link href="/user/account">
        <div
          className={classNames(style['menu-item'], {
            [style.active]: !!(pathname === '/user/account')
          })}
        >
          <span>
            <AiOutlineUser size={18} />
            Edit Profile
          </span>
        </div>
      </Link>
      <Link href="/user/bookmarks">
        <div
          className={classNames(style['menu-item'], {
            [style.active]: !!(pathname === '/user/bookmarks')
          })}
        >
          <span>
            <AiOutlineBook size={18} />
            Bookmarks
          </span>
        </div>
      </Link>
      <Divider />
      <Link href="/user/my-subscription">
        <div
          className={classNames(style['menu-item'], {
            [style.active]: !!(pathname === '/user/my-subscription')
          })}
        >
          <span>
            <AiOutlineHeart size={18} />
            Subscriptions
          </span>
        </div>
      </Link>
      <Link href="/user/purchased-content">
        <div
          className={classNames(style['menu-item'], {
            [style.active]: !!(pathname === '/user/purchased-content')
          })}
        >
          <span>

            <AiOutlineDollar size={18} />
            Purchased content
          </span>
        </div>
      </Link>
      <Divider />
      <Link href="/user/orders">
        <div
          className={classNames(style['menu-item'], {
            [style.active]: !!(pathname === '/user/orders')
          })}
        >
          <span>
            <AiOutlineShoppingCart size={18} />
            Order History
          </span>
        </div>
      </Link>
      <Link href="/user/payment-history">
        <div
          className={classNames(style['menu-item'], {
            [style.active]: !!(pathname === '/user/payment-history')
          })}
        >
          <span>
            <AiOutlineHistory size={18} />
            Payment History
          </span>
        </div>
      </Link>
      <Link href="/user/wallet-transaction">
        <div className={classNames(style['menu-item'], {
          [style.active]: !!(pathname === '/user/wallet-transaction')
        })}
        >
          <span>
            <AiOutlineDollar size={18} />
            Wallet Transactions
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

export default UserDrawerMenu;
