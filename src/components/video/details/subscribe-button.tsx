'use client';

import { IPerformer } from '@interfaces/performer';
import { useRouter } from 'next/navigation';
import { useMainThemeLayout } from 'src/providers/main-layout.provider';
import { useSession } from 'next-auth/react';
import { Button } from 'antd';
import { useIntl } from 'react-intl';
import { showError } from '@lib/message';
import style from './subscribe-buttons.module.scss';

type Props = {
  performer: IPerformer;
};

export default function VideoSubscribeButtons({ performer }: Props) {
  const intl = useIntl();
  const router = useRouter();
  const { setSubscriptionModal } = useMainThemeLayout();
  const { data: session } = useSession();
  const user = session?.user as any;
  const loggedIn = Boolean(session?.user?._id);

  const handleSubscribe = (subscriptionType: string) => {
    if (!loggedIn) {
      showError('Please log in or register!');
      router.push('/');
      return;
    }
    setSubscriptionModal({ open: true, performer, subscriptionType });
  };

  const subcriptionList = [
    {
      lable: intl.formatMessage({
        id: 'monthlySubscriptionFor',
        // eslint-disable-next-line no-template-curly-in-string
        defaultMessage: `Monthly subscription for ${performer.monthlyPrice}`
      }, {
        price: performer.monthlyPrice.toFixed(2)
      }),
      type: 'monthly',
      enable: !performer.isSubscribed && !user?.isPerformer && performer.enabledMonthlyDiscount && loggedIn,
      discount: (performer.monthlyPrice - (performer.monthlyPrice * performer.monthlyDiscount)).toFixed(2),
      persentDiscount: (performer.monthlyDiscount * 100),
      price: performer.monthlyPrice.toFixed(2),
      hidden: !performer.enabledMonthlyDiscount
    },
    {
      lable: intl.formatMessage({
        id: 'quaterlySubscriptionFor',
        // eslint-disable-next-line no-template-curly-in-string
        defaultMessage: `Quaterly subscription for ${performer.quarterlyPrice}`
      }, {
        price: performer.quarterlyPrice.toFixed(2)
      }),
      type: 'quarterly',
      enable: !performer.isSubscribed && !user?.isPerformer && performer.enabledQuarterlyDiscount && loggedIn,
      discount: (performer.quarterlyPrice - (performer.quarterlyPrice * performer.quarterlyDiscount)).toFixed(2),
      persentDiscount: (performer.quarterlyDiscount * 100),
      price: performer.quarterlyPrice.toFixed(2),
      hidden: !performer.enabledQuarterlyDiscount
    },
    {
      lable: intl.formatMessage({
        id: 'halfYearlySubscriptionFor',
        // eslint-disable-next-line no-template-curly-in-string
        defaultMessage: `Half-Yearly subscription for ${performer.halfYearlyPrice}`
      }, {
        price: performer.halfYearlyPrice.toFixed(2)
      }),
      type: 'half_yearly',
      enable: !performer.isSubscribed && !user?.isPerformer && performer.enabledHalfYearlyDiscount && loggedIn,
      discount: (performer.halfYearlyPrice - (performer.halfYearlyPrice * performer.halfYearlyDiscount)).toFixed(2),
      persentDiscount: (performer.halfYearlyDiscount * 100),
      price: performer.halfYearlyPrice.toFixed(2),
      hidden: !performer.enabledHalfYearlyDiscount
    },
    {
      lable:
        intl.formatMessage({
          id: 'yearlySubscriptionFor',
          defaultMessage: `Yearly subscription for ${performer.yearlyPrice}`
        }, {
          price: performer.yearlyPrice.toFixed(2)
        }),
      type: 'yearly',
      enable: !performer.isSubscribed && !user?.isPerformer && performer.enabledYearlyDiscount && loggedIn,
      discount: (performer.yearlyPrice - (performer.yearlyPrice * performer.yearlyDiscount)).toFixed(2),
      persentDiscount: (performer.yearlyDiscount * 100),
      price: performer.yearlyPrice.toFixed(2),
      hidden: !performer.enabledYearlyDiscount
    },
    {
      lable: performer.durationFreeSubscriptionDays > 1
        ? `${intl.formatMessage({ id: 'freeSubcriptionDuration', defaultMessage: 'Free subscription duration' })} ${intl.formatMessage({ id: 'days', defaultMessage: `${performer.durationFreeSubscriptionDays} days` }, { days: performer.durationFreeSubscriptionDays })}`
        : `${intl.formatMessage({ id: 'freeSubcriptionDuration', defaultMessage: 'Free subscription duration' })} ${performer.durationFreeSubscriptionDays} ${intl.formatMessage({ id: 'day', defaultMessage: 'day' })}`,
      type: 'free',
      enable: !performer.isSubscribed && !user?.isPerformer && performer.isFreeSubscription && loggedIn,
      discount: intl.formatMessage({ id: 'free', defaultMessage: 'free' }),
      persentDiscount: 0,
      price: 0,
      hidden: !performer.isFreeSubscription
    }
  ];

  if (!performer) return null;
  if (
    !performer.isFreeSubscription
    && !performer.enabledMonthlyDiscount
    && !performer.enabledQuarterlyDiscount
    && !performer.enabledHalfYearlyDiscount
    && !performer.enabledYearlyDiscount
  ) {
    return null;
  }

  return (
    <>
      {subcriptionList.map((item) => {
        if (item.hidden) return null;
        return (
          <Button
            type="primary"
            className={style['btn-primary']}
            key={item.lable}
            disabled={!item.enable}
            onClick={() => handleSubscribe(item.type)}
          >
            <div className={style['btn-content']}>
              <p className={style['btn-label']}>{item.lable}</p>
              <div className={style['btn-discount']}>
                <p>
                  {
                    typeof item.discount === 'string'
                      && !item.discount.toLowerCase().includes('free')
                      ? `€${item.discount}`
                      : item.discount
                  }
                </p>
              </div>
            </div>
          </Button>
        );
      })}
    </>
  );
}
