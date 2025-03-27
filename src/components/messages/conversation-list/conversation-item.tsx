import { formatDateFromnow } from '@lib/index';
import { IConversation } from '@interfaces/message';
import classnames from 'classnames';
import ImageWithFallback from '@components/common/images/image-fallback';
import { AiOutlineCheck } from 'react-icons/ai';
import style from './conversation-item.module.scss';

interface IProps {
  data: IConversation;
  setActive: Function;
  isActive: boolean;
}

export default function ConversationListItem({
  data, setActive, isActive
}: IProps) {
  const {
    recipientInfo,
    lastMessage,
    totalNotSeenMessages = 0,
    lastMessageCreatedAt,
    updatedAt
  } = data;

  return (
    <div className={classnames(style['c-list-item'], { [style.active]: isActive })}>
      <div className="c-left-corner" aria-hidden onClick={() => setActive(data)}>
        <ImageWithFallback
          options={{
            className: 'c-photo',
            width: 40,
            height: 40,
            sizes: '10vw'
          }}
          fallbackSrc="/no-avatar.jpg"
          src={recipientInfo?.avatar || '/no-avatar.jpg'}
          alt="avatar"
        />
        <span className={classnames('online-status', { active: recipientInfo?.isOnline > 0 })} />
      </div>
      <div className="c-info">
        <div className="flex-name-profile" aria-hidden onClick={() => setActive(data)}>
          <div
            title={recipientInfo?.name || recipientInfo?.username || 'N/A'}
            className="m-user-name"
          >
            {recipientInfo?.name || recipientInfo?.username || 'N/A'}
            {recipientInfo?.verifiedAccount && (<AiOutlineCheck />)}
          </div>
          <span className="c-time">
            {formatDateFromnow(lastMessageCreatedAt || updatedAt)}
          </span>
        </div>
        <div className="c-snippet" aria-hidden onClick={() => setActive(data)}>
          <span className="txt">{lastMessage}</span>
          {!isActive && totalNotSeenMessages > 0 && (
            <span className="badge-notify" />
          )}
        </div>
      </div>
    </div>
  );
}
