import { IPerformer } from '@interfaces/performer';
import { IUser } from '@interfaces/user';
import { showError } from '@lib/message';
import classNames from 'classnames';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useIntl } from 'react-intl';
import { useMainThemeLayout } from 'src/providers/main-layout.provider';
import styles from './subscribe-buttons.module.scss';

type Props = {
  performer: IPerformer;
  onClickSubcription?: () => void,
};

function SubscribeButtons({
  performer,
  onClickSubcription
}: Props) {
  if (!performer) return null;

  if (!performer.isFreeSubscription
    && !performer.enabledMonthlyDiscount
    && !performer.enabledQuarterlyDiscount
    && !performer.enabledHalfYearlyDiscount
    && !performer.enabledYearlyDiscount
  ) return null;

  const intl = useIntl();
  const { data: session } = useSession();
  const user: IUser = session?.user as IUser;

  const router = useRouter();
  const { setSubscriptionModal } = useMainThemeLayout();

  const subcriptionList = [
    {
      lable: intl.formatMessage({ id: 'month', defaultMessage: ' 1 month' }, { month: 1 }),
      type: 'monthly',
      enable: !performer.isSubscribed && !user?.isPerformer && performer.enabledMonthlyDiscount,
      discount: (performer.monthlyPrice - (performer.monthlyPrice * performer.monthlyDiscount)).toFixed(2),
      persentDiscount: (performer.monthlyDiscount * 100),
      price: performer.monthlyPrice.toFixed(2),
      hidden: !performer.enabledMonthlyDiscount
    },
    {
      lable: intl.formatMessage({ id: 'months', defaultMessage: '3 months' }, { month: 3 }),
      type: 'quarterly',
      enable: !performer.isSubscribed && !user?.isPerformer && performer.enabledQuarterlyDiscount,
      discount: (performer.quarterlyPrice - (performer.quarterlyPrice * performer.quarterlyDiscount)).toFixed(2),
      persentDiscount: (performer.quarterlyDiscount * 100),
      price: performer.quarterlyPrice.toFixed(2),
      hidden: !performer.enabledQuarterlyDiscount
    },
    {
      lable: intl.formatMessage({ id: 'months', defaultMessage: '6 months' }, { month: 6 }),
      type: 'half_yearly',
      enable: !performer.isSubscribed && !user?.isPerformer && performer.enabledHalfYearlyDiscount,
      discount: (performer.halfYearlyPrice - (performer.halfYearlyPrice * performer.halfYearlyDiscount)).toFixed(2),
      persentDiscount: (performer.halfYearlyDiscount * 100),
      price: performer.halfYearlyPrice.toFixed(2),
      hidden: !performer.enabledHalfYearlyDiscount
    },
    {
      lable: intl.formatMessage({ id: 'months', defaultMessage: '12 months' }, { month: 12 }),
      type: 'yearly',
      enable: !performer.isSubscribed && !user?.isPerformer && performer.enabledYearlyDiscount,
      discount: (performer.yearlyPrice - (performer.yearlyPrice * performer.yearlyDiscount)).toFixed(2),
      persentDiscount: (performer.yearlyDiscount * 100),
      price: performer.yearlyPrice.toFixed(2),
      hidden: !performer.enabledYearlyDiscount
    },
    {
      lable: performer.durationFreeSubscriptionDays > 1 ? intl.formatMessage({ id: 'days', defaultMessage: `${performer.durationFreeSubscriptionDays} days` }, { month: performer.durationFreeSubscriptionDays }) : `${performer.durationFreeSubscriptionDays} ${intl.formatMessage({ id: 'day', defaultMessage: 'day' })}`,
      type: 'free',
      enable: !performer.isSubscribed && !user?.isPerformer && performer.isFreeSubscription,
      discount: intl.formatMessage({ id: 'free', defaultMessage: 'free' }),
      persentDiscount: 0,
      price: 0,
      hidden: !performer.isFreeSubscription
    }
  ];

  const handleSubscribe = (subscriptionType: string) => {
    if (!user?._id) {
      showError(intl.formatMessage({ id: 'pleaseLogInOrRegister', defaultMessage: 'Please log in or register!' }));
      setSubscriptionModal({ open: false, performer: null });
      router.push('/login');
      return;
    }
    setSubscriptionModal({ open: true, performer, subscriptionType });
    if (onClickSubcription) {
      onClickSubcription();
    }
  };

  return (
    <div className={styles['subcriptions-wrapper']}>
      <div className={styles['subcriptions-header']}>
        {intl.formatMessage({ id: 'subcription', defaultMessage: 'subcription' })}
      </div>
      <div className={styles['subcriptions-list']}>
        {
          subcriptionList.map((item) => {
            if (item.hidden) return null;
            return (
              <button
                type="button"
                className={classNames(
                  styles['subcriptions-item'],
                  {
                    [styles.isFreeSubcription]: ['free'].includes(item.type)
                  }
                )}
                key={item.lable}
                disabled={!item.enable}
                onClick={() => handleSubscribe(item.type)}
              >
                <p className={styles['subcriptions-name']}>
                  {item.lable}
                </p>
                <div className={styles['subcriptions-price']}>
                  <p>
                    {!item.discount.includes('Free') && '€'}
                    {item.discount}
                  </p>
                </div>
              </button>
            );
          })
        }
      </div>
    </div>
  );
}

SubscribeButtons.defaultProps = {
  onClickSubcription: () => { }
};
export default SubscribeButtons;
