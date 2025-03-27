'use client';

import { Divider, Dropdown, MenuProps } from 'antd';
import Link from 'next/link';
import { IUser } from '@interfaces/user';
import { copyToClipboard } from '@lib/action';
import { useSession } from 'next-auth/react';
import { AiOutlineMore } from 'react-icons/ai';
import { useIntl } from 'react-intl';
import { IFeed } from '@interfaces/feed';
import style from './dropdown-actions.module.scss';

type Props = {
  media: IFeed;
  onPin?: any;
};

export default function DropdownActions({ media, onPin }: Props) {
  const intl = useIntl();
  const { data: session } = useSession();
  const user: IUser = session?.user as IUser;

  const items: MenuProps['items'] = [
    {
      key: `media_detail_${media?._id}`,
      label: (
        <Link href={`/post/${media?.slug || media?._id}`}>
          {intl.formatMessage({ id: 'detail', defaultMessage: 'Details' })}
        </Link>
      )
    },

    {
      key: `media_pin_${media?._id}`,
      label: (
        (user?._id === media?.fromSourceId || user?._id === media?.performer?._id)
          ? (
            <button
              type="button"
              onClick={() => onPin(media?._id)}
              className={style['dropdown-options']}
            >
              {intl.formatMessage({
                id: media?.isPinned ? 'unpinFromProfile' : 'pinToProfile',
                defaultMessage: media.isPinned ? 'Unpin from profile' : 'Pin to profile'
              })}
            </button>
          )
          : null
      )
    },
    {
      key: `copy_link_${media?._id}`,
      label: (
        <a
          aria-hidden
          onClick={() => copyToClipboard(`${process.env.SITE_URL}/post/${media?.slug || media?._id}`)}
        >
          {intl.formatMessage({ id: 'copyToClipboard', defaultMessage: 'Copy link to clipboard' })}
        </a>
      )
    }
  ];

  if ((user?._id === media?.fromSourceId || user?._id === media?.performer?._id) && media?.isFree) {
    items.push(
      ...[
        {
          key: 'divider',
          label: <Divider style={{ margin: '10px 0' }} />
        },
        {
          key: `edit_${media?._id}`,
          label: (
            <Link href={`/my-post/edit/${media?._id}`}>
              {intl.formatMessage({ id: 'editPost', defaultMessage: 'Edit post' })}
            </Link>
          )
        }
      ]
    );
  }

  return (
    <Dropdown
      menu={{ items }}
      className={style['dropdown-options']}
      rootClassName={style.dropdown}
      trigger={['click']}
    >
      <AiOutlineMore />
    </Dropdown>
  );
}
