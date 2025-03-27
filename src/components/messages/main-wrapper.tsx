'use client';

import {
  Button
} from 'antd';
import { useMessage } from 'src/providers/message.provider';
import classNames from 'classnames';
import { useIntl } from 'react-intl';
import style from './main-wrapper.module.scss';
import ConversationList from './conversation-list';
import MessageList from './message-list';

export default function Messenger() {
  const {
    activeConversation
  } = useMessage();
  const intl = useIntl();

  return (
    <div className={style.messenger}>
      <div className={classNames('cv-list-wrapper', { active: !!activeConversation })}>
        <Button
          type="link"
          href="/home"
          className="home-btn"
        >
          {intl.formatMessage({ id: 'close', defaultMessage: 'Close' })}
        </Button>
        <ConversationList
          conversation={activeConversation}
        />
      </div>
      <div className={classNames('chat-content', { active: !!activeConversation?._id })}>
        <MessageList />
      </div>
    </div>
  );
}
