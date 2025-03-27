import React from 'react';
import { IPerformer } from '@interfaces/performer';
import Link from 'next/link';
import styles from './style.module.scss';

interface IProps {
  performer: IPerformer
}
export default function NewestCard({ performer }: IProps) {
  return (
    <Link href={`/${performer.username || performer._id}`} className={styles['card-wrapper']}>
      <img
        className={styles['card-thumb']}
        src={performer?.avatar || '/no-avatar.jpg'}
        width="100%"
        height={250}
        alt={performer.username}
      />
      <p className={styles['card-name']}>
        {performer?.name || performer?.username || 'N/A'}
      </p>
    </Link>
  );
}
