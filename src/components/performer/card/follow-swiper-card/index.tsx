import React from 'react';
import Link from 'next/link';
import classNames from 'classnames';
import Image from 'next/image';
import { IPerformer } from '@interfaces/performer';
import styled from './style.module.scss';

interface IProps {
  performer: IPerformer,
  activePer: string,
  onClick: Function
}
export default function FollowSwiperCard({ performer, activePer, onClick }: IProps) {
  return (
    <div
      className={classNames(
        styled['card-wrapper'],
        { [styled.active]: !!(activePer === performer._id) }
      )}
    >
      <a onClick={() => onClick(performer._id)} aria-hidden>
        <Image
          src={performer?.avatar || '/no-avatar.jpg'}
          alt={performer?.username}
          className={styled['card-avatar']}
          width={77}
          height={77}
        />
      </a>
      <Link href={`/${performer?.username || performer?._id}`} className={styled['card-name']}>
        {performer.name}
      </Link>
    </div>
  );
}
