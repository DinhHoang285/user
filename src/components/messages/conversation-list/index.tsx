'use client';

import { showError } from '@lib/message';
import { replaceRouteState } from '@lib/swr-fetch';
import { messageService } from '@services/message.service';
import { Skeleton } from 'antd';
import { debounce } from 'lodash';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { IConversation } from 'src/interfaces';
import { useMessage } from 'src/providers/message.provider';
import { useSession } from 'next-auth/react';
import { MessageIcon } from 'src/icons';
import { useIntl } from 'react-intl';
import classNames from 'classnames';
import ConversationListItem from './conversation-item';
import ConversationSearch from './search-bar';
import style from './style.module.scss';
import ContentBlockToggel from './ContentBlockToggel';

export default function ConversationList({ conversation }: { conversation: IConversation }) {
  const limit = 25;
  const conversationsRef = useRef(null) as any;
  const { setActiveConversation, activeContentLocker, setActiveContentLockerToggle } = useMessage();
  const prevItems = useRef([]);
  const createdCt = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationsData, setConversations] = useState<{ total: number; data: IConversation[] }>({ total: 0, data: [] });
  const { data: session } = useSession();
  const params = Object.fromEntries(useSearchParams().entries());
  const intl = useIntl();

  const getConversationsHandler = async () => {
    try {
      setIsLoading(true);
      const payload = {
        limit,
        offset: (Number(params.page || 1) - 1) * Number(limit),
        keyword: params.keyword || ''
      };
      const resp = activeContentLocker
        ? await messageService.getPurchaseConversations(payload)
        : await messageService.getConversations(payload);

      if (resp.data) {
        setConversations(resp.data);
      }
    } catch (error) {
      showError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSearchConversation = debounce(async (e) => {
    const { value: q } = e.target;
    replaceRouteState({ keyword: q, page: 1 });
  }, 500);

  const handleScroll = async (event: any) => {
    const canloadmore = conversationsData.total > (conversationsData.data?.length || 0);
    const ele = event.target;
    if (!canloadmore) return;
    if ((ele.offsetHeight + ele.scrollTop >= ele.scrollHeight - 10) && !isLoading && canloadmore) {
      prevItems.current = [...prevItems.current, ...conversationsData.data];
      replaceRouteState({ keyword: params.keyword, page: Number(params.page || 1) + 1 });
    }
  };

  const setActive = async (c: IConversation) => {
    if (conversation?._id === c._id) {
      setActiveConversation(null);
      return;
    }
    setActiveConversation({ ...c, totalNotSeenMessages: 0 });
    if (c.totalNotSeenMessages > 0) {
      await messageService.readAllInConversation(c._id);
    }
  };

  const onToggleClick = () => {
    setActiveContentLockerToggle();
  };

  useEffect(() => {
    if (params.toId && params.toSource && !createdCt.current) {
      const getConversation = async () => {
        const resp = await messageService.createConversation({
          source: params.toSource,
          sourceId: params.toId
        });
        createdCt.current = true;
        if (resp?.data) {
          setActive(resp.data);
        }
      };
      getConversation();
    }
  }, [params]);

  useEffect(() => {
    getConversationsHandler();
  }, [params.keyword, activeContentLocker]);

  return (
    <>
      <div
        className={classNames([
          style['user-bl'],
          { [style.active]: !activeContentLocker }
        ])}
        onClick={onToggleClick}
        onKeyPress={(e) => { if (e.key === 'Enter') onToggleClick(); }}
        role="button"
        tabIndex={0}
      >
        <MessageIcon />
        &nbsp;
        {intl.formatMessage({ id: 'messages', defaultMessage: 'Messages' })}
      </div>
      {!session?.user.isPerformer && (
        <ContentBlockToggel
          onToggleClick={onToggleClick}
          activeContentToggle={activeContentLocker}
        />
      )}
      <ConversationSearch onSearch={onSearchConversation} />
      <div
        className={style['conversation-list']}
        ref={conversationsRef}
        onScroll={handleScroll}
      >
        {[...prevItems.current, ...(conversationsData?.data || [])].map((c: IConversation) => (
          <ConversationListItem
            key={c._id}
            data={c}
            setActive={setActive}
            isActive={conversation?._id === c._id}
          />
        ))}
        {isLoading && (
          <Skeleton paragraph={{ rows: 4 }} />
        )}
        {!isLoading && !conversationsData?.data?.length && (
          <p className="text-center" style={{ margin: 30 }}>
            {intl.formatMessage({ id: 'noConversationFound', defaultMessage: 'No conversation found.' })}
          </p>
        )}
      </div>
    </>
  );
}
