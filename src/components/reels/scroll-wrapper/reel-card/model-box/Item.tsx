'use client';

import { IFeed } from '@interfaces/feed';
import { IUser } from '@interfaces/user';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AiOutlineEye, AiOutlineLock } from 'react-icons/ai';
import styles from './Item.module.scss';

interface IProps {
  item: IFeed
}

function Item({ item }: IProps) {
  const { data: session } = useSession();
  const user: IUser = session?.user as IUser;
  const searchParams = useSearchParams();
  const locale = searchParams.get('locale') || 'en';

  const canView = item.isFree
    || (item.isSub && item.isSubscribed)
    || (item.isSale && item.price && item.isBought)
    || (item.isSale && !item.price)
    || (item.performer._id === user._id);

  return (
    <Link
      href={`/${locale}/reels?includedId=${item._id}&isAd=${!!item?.isAd}&performerId=${item?.performer?._id}`}
      className={styles['listing-item']}
    >
      <img
        className={styles['listing-item-image']}
        src={(item?.files.length && item?.files[0].thumbnails?.length) ? item?.files[0].thumbnails[0] : '/no-image.jpg'}
        alt={item.title || 'Video thumbnail'}
      />
      <div className={styles['listing-item-stas']}>
        <span>
          <AiOutlineEye />
        </span>
        <p>{item?.totalViews}</p>
      </div>
      {
        !canView && (
          <div className={styles['listing-item-block']}>
            <p>
              <span>
                <AiOutlineLock />
              </span>
            </p>
          </div>
        )
      }
    </Link>
  );
}

export default Item;
