/* eslint-disable react/jsx-closing-tag-location */

'use client';

import { IFeed } from '@interfaces/feed';
import { copyToClipboard } from '@lib/action';
import { AiOutlineMore } from 'react-icons/ai';
import { useIntl } from 'react-intl';
import { Dropdown } from 'antd';
import Link from 'next/link';

export default function DropdownPostTop({ feed }: { feed: IFeed; }) {
  const path = `${process.env.SITE_URL}/post/${feed.slug || feed._id}`;
  const intl = useIntl();
  const items = [
    {
      key: 'details',
      label: (
        <Link
          href={`/post/${feed.slug}`}
        >

          {intl.formatMessage({ id: 'details', defaultMessage: 'Details' })}
        </Link>
      )
    },
    {
      key: 'copy',
      label: (
        <a>
          {intl.formatMessage({ id: 'copyLink', defaultMessage: 'Copy link' })}
        </a>
      ),
      onClick: () => copyToClipboard(path)
    }
  ];

  return (
    <Dropdown menu={{ items }} className="p-more-dropdown">
      <span>
        <AiOutlineMore />
      </span>
    </Dropdown>
  );
}
