/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

'use client';

/* eslint-disable @typescript-eslint/no-unused-vars */

import ImageWithFallback from '@components/common/images/image-fallback';
import { IMessage } from '@interfaces/message';
import { messageService } from '@services/message.service';
import { Dropdown, Spin } from 'antd';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  useContext, useEffect, useRef, useState
} from 'react';
import { AiOutlineCheck, AiOutlineMore } from 'react-icons/ai';
import { useMessage } from 'src/providers/message.provider';
import ViewMediaPopupContainer from 'src/providers/view-media-popup/provider';
import { Event, SocketContext } from 'src/socket';
import { useIntl } from 'react-intl';
import { showError } from '@lib/message';
import style from './index.module.scss';

const moment = require('moment');
const uniqBy = require('lodash/uniqBy');

const Compose = dynamic(() => (import('../compose')));
const Message = dynamic(() => (import('./message-item')));

export default function MessageList() {
  const router = useRouter();
  const intl = useIntl();

  const messagesRef = useRef(null) as any;
  const {
    setActiveConversation, activeConversation: conversation, activeContentLocker
  } = useMessage();

  const limit = 25;
  const total = useRef(0);
  const offset = useRef(0);
  const [items, setItems] = useState([]);
  const [fetching, setFetching] = useState(true);
  const { data: session } = useSession();
  const { socket } = useContext(SocketContext);
  const [isBlock, setIsBlock] = useState(conversation?.isBlockedMessage || false);

  const handleBlockUserInMessage = async () => {
    try {
      await messageService.blockConversation(conversation._id);
      setIsBlock(!isBlock);
    } catch (error) {
      showError(
        intl.formatMessage({
          id: 'blockError',
          defaultMessage: 'An error occurred while updating block status.'
        })
      );
    }
  };

  const itemsDropdown: any['items'] = [
    {
      label: (
        <div onClick={handleBlockUserInMessage}>
          {!isBlock
            ? intl.formatMessage({
              id: 'blockUserInMessages',
              defaultMessage: 'Block user in messages'
            })
            : intl.formatMessage({
              id: 'unblockUserInMessages',
              defaultMessage: 'Unblock user in messages'
            })}
        </div>
      ),
      key: '0'
    }
  ];

  const getItems = async () => {
    setFetching(true);
    const payload = {
      limit,
      offset: limit * offset.current
    };
    const resp = activeContentLocker
      ? await messageService.getPurchaseMessages(conversation._id, payload)
      : await messageService.getMessages(conversation._id, payload);
    const _data = resp.data.data.reverse();
    offset.current === 0 ? setItems(_data) : setItems((_items) => [..._data, ..._items]);
    setFetching(false);
    total.current = resp.data.total;
  };

  useEffect(() => {
    scrollToBottom();
  }, [items]);

  useEffect(() => {
    offset.current = 0;
    setItems([]);
    conversation?._id && getItems();
  }, [conversation, activeContentLocker]);

  const handleScroll = (event) => {
    const ele = event.target;
    if (total.current <= items.length) return;
    if (ele.scrollTop === 0 && conversation?._id && !fetching) {
      offset.current += 1;
      getItems();
      setTimeout(() => {
        const getMeTo = document.getElementById(items[0]._id);
        getMeTo && getMeTo.scrollIntoView({ behavior: 'auto', block: 'center' });
      }, 1000);
    }
  };

  const renderMessages = () => {
    let i = 0;
    const messageCount = items.length;
    const tempMessages = [];
    while (i < messageCount) {
      const next = items[i + 1];
      const previous = items[i - 1];
      const current = items[i];
      const isMine = current.senderId === session?.user?._id;
      const currentMoment = moment(current.createdAt);
      let showTimestamp = true;
      let startsSequence = true;
      let endsSequence = true;
      let prevBySameAuthor = false;
      let nextBySameAuthor = false;

      if (previous) {
        const previousMoment = moment(previous.createdAt);
        const previousDuration = moment.duration(
          currentMoment.diff(previousMoment)
        );
        prevBySameAuthor = previous.senderId === current.senderId;
        if (prevBySameAuthor && previousDuration.as('hours') < 1) {
          startsSequence = false;
        }
        if (previousDuration.as('hours') < 1) {
          showTimestamp = false;
        }
      }
      if (next) {
        const nextMoment = moment(next.createdAt);
        const nextDuration = moment.duration(nextMoment.diff(currentMoment));
        nextBySameAuthor = next.senderId === current.senderId;

        if (nextBySameAuthor && nextDuration.as('hours') < 1) {
          endsSequence = false;
        }
      }
      if (current._id) {
        tempMessages.push(
          <Message
            key={current.isDeleted ? `${current._id}_deleted` : `${current._id}`}
            isMine={isMine}
            startsSequence={startsSequence}
            endsSequence={endsSequence}
            showTimestamp={showTimestamp}
            data={current}
            recipient={conversation?.recipientInfo as any}
            currentUser={session?.user}
            isSubscribed={(conversation as any).isSubscribed}
            onRemoveMessage={onRemoveMessage}
          />
        );
      }
      i += 1;
    }

    return tempMessages;
  };

  const scrollToBottom = () => {
    if (fetching) return;
    const ele = messagesRef.current as any;
    if (ele && ele.scrollTop === ele.scrollHeight) return;
    window.setTimeout(() => {
      ele && ele.scrollTo({ top: ele.scrollHeight, behavior: 'smooth' });
    }, 500);
  };

  const onNewMessage = (item: IMessage) => {
    setItems((_items) => (uniqBy([..._items, item], (m) => m._id)));
    total.current += 1;
    scrollToBottom();
  };

  const onRemoveMessage = (item) => {
    setItems((_items) => _items.filter((i) => i._id !== item._id));
    total.current -= 1;
  };

  const blockStatusHandle = (data) => {
    if (data.userId === session.user._id) {
      setIsBlock(data.isBlockedMessage);
    }
  };

  useEffect(() => {
    const onMessage = (m: IMessage, event = 'created') => {
      if (!m) {
        return;
      }
      if (event === 'created') {
        onNewMessage(m);
      }
      if (event === 'deleted') {
        onRemoveMessage(m);
      }
    };

    socket && socket.on('pin_message_updated', (m) => onMessage(m, 'pinned'));
    socket && socket.on('message_created', (m) => onMessage(m, 'created'));
    socket && socket.on('message_deleted', (m) => onMessage(m, 'deleted'));

    return () => {
      socket && socket.off('pin_message_updated', (m) => onMessage(m, 'pinned'));
      socket && socket.off('message_created', (m) => onMessage(m, 'created'));
      socket && socket.off('message_deleted', (m) => onMessage(m, 'deleted'));
    };
  }, [socket]);

  return (
    <ViewMediaPopupContainer>
      <Event event="block-status-conversation" handler={blockStatusHandle} />
      {conversation?._id ? (
        <>
          <div className={style['mess-recipient']}>
            <div
              className="recipient-item"
              aria-hidden
              onClick={() => conversation?.recipientInfo?.isPerformer && router.push(`/${conversation.recipientInfo.username}`)}
            >
              <ImageWithFallback
                options={{
                  width: 60,
                  height: 60,
                  sizes: '10vw'
                }}
                alt="avatar"
                src={conversation?.recipientInfo?.avatar || '/no-avatar.jpg'}
                fallbackSrc="/no-avatar.jpg"
              />
              {conversation?.recipientInfo?.name || conversation?.recipientInfo?.username || intl.formatMessage({
                id: 'notAvailable',
                defaultMessage: 'N/A'
              })}
              {conversation?.recipientInfo?.verifiedAccount && (<AiOutlineCheck />)}
            </div>
            <div>
              {session?.user?.isPerformer && (
                <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
                  <button className="more-btn" type="button" onClick={(e) => e.preventDefault()}>
                    <span>
                      <AiOutlineMore />
                    </span>
                  </button>
                </Dropdown>
              )}
            </div>
          </div>

          <div className={style['message-list']}>
            <div className="message-list-container" ref={messagesRef} onScroll={handleScroll}>
              {fetching && (
                <div className="text-center">
                  <Spin />
                </div>
              )}
              {renderMessages()}
              {!fetching && !items.length && (
                <p className="text-center">
                  {intl.formatMessage({
                    id: 'letsTalk',
                    defaultMessage: 'Let\'s talk'
                  })}
                </p>
              )}
              {conversation && !conversation?.isSubscribed && !activeContentLocker && (
                <Link href={`/${conversation?.recipientInfo?.username}`}>
                  <div className={style['sub-text-subscribe']}>
                    {intl.formatMessage({
                      id: 'subscribeProfile',
                      defaultMessage: 'Subscribe to this profile to start a conversation!'
                    })}
                  </div>
                </Link>
              )}
              {
                (conversation.isBlocked || conversation.isBlockedMessage || isBlock) && !activeContentLocker && (
                  <div className={style['sub-text']}>
                    {session?.user?.isPerformer
                      ? intl.formatMessage({
                        id: 'youHaveBlockedThisUser!',
                        defaultMessage: 'You have blocked this user!'
                      })
                      : intl.formatMessage({
                        id: 'thisCreatorHasBlockedYou!',
                        defaultMessage: 'This creator has blocked you!'
                      })}
                  </div>
                )
              }
            </div>
          </div>
        </>
      ) : (
        <p className="text-center" style={{ width: '100%', margin: 30 }}>
          {intl.formatMessage({
            id: 'messageConversation',
            defaultMessage: 'Click on conversation to start'
          })}
        </p>
      )}
      {conversation?._id && !activeContentLocker && (
        <Compose
          disabled={!conversation.isSubscribed || conversation.isBlocked || isBlock}
          conversation={conversation}
          onNewMessage={onNewMessage}
        />
      )}
    </ViewMediaPopupContainer>
  );
}
