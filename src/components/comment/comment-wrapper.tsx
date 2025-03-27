'use client';

import {
  useEffect, useRef, useState
} from 'react';
import dynamic from 'next/dynamic';
import { AiOutlineClose } from 'react-icons/ai';
import { useIntl } from 'react-intl';
import styles from './comment-wrapper.module.scss';
import { ListComments } from './list-comments';

const CommentForm = dynamic(() => import('./comment-form'));

type Props = {
  objectType: string;
  objectId: string;
  limit?: number;
  offset?: number;
  canReply?: boolean;
  showHead?: boolean;
  showClose?: boolean;
  onClickClose?: Function;
};

export default function CommentWrapper({
  objectType,
  objectId,
  limit = 10,
  offset = 0,
  canReply = true,
  showHead = false,
  showClose = false,
  onClickClose = () => { }
}: Props) {
  const intl = useIntl();
  const listRef = useRef(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
  }, [listRef.current]);

  return (
    <>
      {showHead
        && (
          <div className={styles['comment-header']}>
            <span>
              <span>{total}</span>
              {' '}
              {total > 1 ? intl.formatMessage({ id: 'comments', defaultMessage: 'comments' })
                : intl.formatMessage({ id: 'comment', defaultMessage: 'comment' })}
            </span>
            {showClose
              && (
                <button type="button" onClick={() => onClickClose()}>
                  <AiOutlineClose />
                </button>
              )}
          </div>
        )}
      <CommentForm
        onSuccess={(values) => {
          listRef.current && listRef.current.appendNew(values);
          setTotal((prev) => prev + 1);
        }}
        objectId={objectId}
        objectType={objectType}
      />
      <ListComments
        key={`comments_${objectId}`}
        objectId={objectId}
        objectType={objectType}
        limit={limit}
        offset={offset}
        ref={listRef}
        canReply={canReply}
        onDeleteSuccess={() => {
          setTotal((prev) => prev - 1);
        }}
        getTotal={(val) => {
          setTotal((prev) => {
            if (prev > val) return prev;
            return val;
          });
        }}
      />
    </>
  );
}
