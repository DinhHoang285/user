'use client';

import { IFeed } from '@interfaces/feed';
import { shortenLargeNumber } from '@lib/number';
import { RiChat3Fill, RiChat3Line } from 'react-icons/ri';

export default function CommentReelButton({ item, isActive, onClick }: { item: IFeed, isActive: boolean; onClick: Function }) {
  return (
    <button
      type="button"
      onClick={() => onClick()}
      className={isActive ? 'active' : ''}
    >
      <span className="icon">
        {isActive ? <RiChat3Fill /> : <RiChat3Line />}
      </span>
      {item.totalComment > 0 && shortenLargeNumber(item.totalComment)}
    </button>

  );
}
