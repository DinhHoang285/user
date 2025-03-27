'use client';

import { messageService } from '@services/message.service';
import classNames from 'classnames';
import { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useMessage } from 'src/providers/message.provider';
import { showError } from '@lib/message';
import { useSession } from 'next-auth/react';
import style from './ContentBLockToogel.module.scss';

interface IProps {
  onToggleClick: Function;
  activeContentToggle: boolean
}
function ContentBlockToggel({ onToggleClick, activeContentToggle }: IProps) {
  const intl = useIntl();
  const { data: session } = useSession();
  const { setContentLockerTotal, contentLockerTotal } = useMessage();
  const getData = async () => {
    try {
      const resp = await messageService.getTotalConversationBlocker();
      setContentLockerTotal(resp.data);
    } catch (error) {
      showError('error');
    }
  };
  useEffect(() => {
    if (session?.user?._id) {
      getData();
    }
  }, []);
  return (
    // eslint-disable-next-line react/button-has-type
    <button
      className={classNames(
        style['content-block-wrapper'],
        { [style.active]: activeContentToggle }
      )}
      onClick={() => onToggleClick()}
    >
      {intl.formatMessage({ id: 'contentBlocker', defaultMessage: 'Content Blocker' })}
      <span>
        (
        {contentLockerTotal}
        )
      </span>
    </button>
  );
}

export default ContentBlockToggel;
