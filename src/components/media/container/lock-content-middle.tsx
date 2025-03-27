import React from 'react';
import dynamic from 'next/dynamic';
import { IFeed } from '@interfaces/feed';
import styles from './lock-content-middle.module.scss';

const LockContentFeed = dynamic(() => import('@components/feed/cards/card-container/lock-content-middle'));

interface IProps {
  feed: IFeed;
  onPaymentSuccess: Function;
}

function LockContentMiddle({ feed, onPaymentSuccess }: IProps) {
  return (
    <div className={styles['lock-content']}>
      <LockContentFeed
        feed={feed}
        onPaymentSuccess={onPaymentSuccess}
      />
      ;
    </div>
  );
}

export default LockContentMiddle;
