import React from 'react';
import Link from 'next/link';
import classNames from 'classnames';
import styled from '../follow-swiper-card/style.module.scss';

interface IProps {
  performer: any;
  activePer: string;
  onClick: Function;
}

export default function BookmarkCard({ performer, activePer, onClick }: IProps) {
  const handleClick = () => {
    if (performer?.objectInfo?._id) {
      onClick(performer?.objectInfo?._id);
    } else {
      onClick(performer?._id);
    }
  };

  return (
    <div
      className={classNames(styled['card-wrapper'], {
        [styled.active]:
          activePer === performer._id || activePer === performer?.objectId
      })}
    >
      <button
        style={{ border: 'none', background: 'transparent' }}
        type="button"
        className={styled['card-avatar-button']}
        onClick={handleClick}
      >
        <img
          src={
            performer?.objectInfo?.avatar
            || performer?.avatar
            || '/no-avatar.jpg'
          }
          alt={
            performer?.objectInfo?.name
            || performer?.name
            || 'N/A'
          }
          className={styled['card-avatar']}
        />
      </button>
      <Link
        href={`/${performer?.objectInfo?.username
          || performer?.objectInfo?._id
          || performer?.username
          || performer?._id}`}
        className={styled['card-name']}
      >
        {performer?.objectInfo?.name || performer?.name || 'N/A'}
      </Link>
    </div>
  );
}
