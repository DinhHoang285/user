'use client';

import { IFeed } from '@interfaces/feed';
import { showError } from '@lib/message';
import { useSession } from 'next-auth/react';
import { useIntl } from 'react-intl';
import { useMainThemeLayout } from 'src/providers/main-layout.provider';

type IProps = {
  onMouseEnter: Function;
  onMouseLeave: Function;
  feed: IFeed;
}

export default function SubscribePostBtn({
  onMouseEnter, onMouseLeave, feed
}: IProps) {
  const { data: session } = useSession();
  const intl = useIntl();
  const { setSubscriptionModal, setLoginModal } = useMainThemeLayout();

  return (
    <button
      onMouseEnter={onMouseEnter.bind(this)}
      onMouseLeave={onMouseLeave.bind(this)}
      type="button"
      disabled={session?.user?.isPerformer}
      onClick={() => {
        if (!session?.user?._id) {
          showError(intl.formatMessage({ id: 'pleaseLoginOrRegister', defaultMessage: 'Please login or register' }));
          setLoginModal({ openForm: 'login' });
          return;
        }
        if (session?.user?.isPerformer) return;
        setSubscriptionModal({ open: true, performer: feed.performer, subscriptionType: 'monthly' });
      }}
    >
      <span>{intl.formatMessage({ id: 'subscribeToUnlock', defaultMessage: 'Subscribe to unlock' })}</span>
    </button>
  );
}
