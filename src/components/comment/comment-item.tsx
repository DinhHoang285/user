'use client';

import { AiOutlineCaretUp, AiOutlineMore, AiOutlineCheck } from 'react-icons/ai';
import {
  Dropdown, MenuProps
} from 'antd';
import classNames from 'classnames';
import moment from 'moment';
import dynamic from 'next/dynamic';
import {
  useEffect, useRef, useState
} from 'react';
import { useIntl } from 'react-intl';
import { IComment, IUser } from 'src/interfaces/index';
import { useSession } from 'next-auth/react';
import style from './comment-item.module.scss';
import { ListComments } from './list-comments';

const CommentForm = dynamic(() => import('./comment-form'), { ssr: false });

interface IProps {
  item: IComment;
  onDelete?: Function;
  canReply?: boolean;
}

function CommentItem({
  item,
  onDelete = () => { },
  canReply = true
}: IProps) {
  const intl = useIntl();
  const [totalReply, setTotalReply] = useState(item.totalReply);
  const [isOpenComment, setIsOpenComment] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isReply, setIsReply] = useState(false);
  const listRef = useRef(null);
  const { data: session } = useSession();
  const user: IUser = session?.user as IUser;

  const onOpenComment = () => {
    setIsOpenComment(!isOpenComment);
  };

  const onNewComment = (val) => {
    listRef.current?.appendNew(val);
    setTotalReply(totalReply + 1);
  };

  const items: MenuProps['items'] = [
    {
      key: item._id,
      label: intl.formatMessage({ id: 'delete', defaultMessage: 'Delete' }),
      onClick: () => onDelete(item)
    }
  ];

  useEffect(() => {
    setTotalReply(item.totalReply);
  }, [item.totalReply]);

  return (
    <>
      <div
        className={classNames(
          style['cmt-item']
        )}
        key={item._id}
      >
        <img alt="creator-avt" src={item?.creator?.avatar || '/no-avatar.jpg'} />
        <div className="cmt-content">
          <div className="cmt-user">
            <span>
              <span style={{
                color: item?.creator?._id === user._id ? '#E776E3' : '#09B3F2'
              }}
              >
                {item?.creator?.name || item?.creator?.username || 'N/A'}
              </span>
              {item.creator && item.creator.verifiedAccount && item.creator.isPerformer && (
                <span className="cmt-tick"><AiOutlineCheck /></span>
              )}
              <span className="cmt-time">{moment(item.createdAt).fromNow()}</span>
            </span>
            {user && item?.isAuth && (
              <Dropdown
                menu={{ items }}
                trigger={['click']}
                rootClassName={style.dropdown}
              >
                <span>
                  <AiOutlineMore />
                </span>
              </Dropdown>
            )}
          </div>
          <p className="cmt-text">{item.content}</p>
          <div className={isReply ? `${style['reply-bl-form']} ${style.active}` : style['reply-bl-form']}>
            <div className="feed-comment">
              <CommentForm
                onSuccess={onNewComment}
                objectId={item._id}
                objectType="comment"
                isReply
              />
            </div>
          </div>
          {canReply && totalReply > 0 && (
            <div className={style['view-cmt']}>
              <a className="primary-color" aria-hidden onClick={() => onOpenComment()}>
                <span>
                  {' '}
                  <AiOutlineCaretUp rotate={!isOpenComment ? 180 : 0} />
                  {' '}
                  {!isOpenComment ? intl.formatMessage({ id: 'viewReply', defaultMessage: 'View reply' }) : intl.formatMessage({ id: 'hideReply', defaultMessage: 'Hide reply' })}
                </span>
              </a>
            </div>
          )}
        </div>
      </div>
      {isOpenComment && (
        <div className={style['reply-bl-list']}>
          <ListComments
            key={`comments_${item._id}`}
            objectId={item._id}
            objectType="comment"
            ref={listRef}
            canReply={false}
          />
        </div>
      )}
    </>
  );
}

CommentItem.defaultProps = {
  onDelete: () => { },
  canReply: false
};

export default CommentItem;
