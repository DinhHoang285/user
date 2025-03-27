'use client';

import { IFeed } from '@interfaces/feed';
import { showError } from '@lib/message';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useMainThemeLayout } from 'src/providers/main-layout.provider';

const PurchaseFeedForm = dynamic(() => import('./confirm-modal'), { ssr: false });

type P = {
  onMouseEnter: Function;
  onMouseLeave: Function;
  feed: IFeed;
  onPaymentSuccess?: Function;
}

export default function PurchasePostBtn({
  onMouseEnter, onMouseLeave, feed, onPaymentSuccess
}: P) {
  const { data: session } = useSession();
  const { setLoginModal } = useMainThemeLayout();
  const [openPurchaseModal, setOpenPurchaseModal] = useState(false);
  const intl = useIntl();

  return (
    <>
      <button
        type="button"
        onMouseEnter={onMouseEnter.bind(this)}
        onMouseLeave={onMouseLeave.bind(this)}
        disabled={session?.user?.isPerformer}
        onClick={() => {
          if (!session?.user?._id) {
            showError(intl.formatMessage({ id: 'pleaseLofinToPurchase', defaultMessage: 'Please login to purchase' }));
            setLoginModal({ openForm: 'login' });
            return;
          }
          setOpenPurchaseModal(true);
        }}
      >
        {`Unlock for €${(feed.price || 0).toFixed(2)}`}
      </button>
      {openPurchaseModal && (
        <PurchaseFeedForm
          feed={feed}
          onClose={() => setOpenPurchaseModal(false)}
          onPaymentSuccess={onPaymentSuccess}
        />
      )}
    </>
  );
}
