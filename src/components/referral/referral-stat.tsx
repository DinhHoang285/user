import { IReferralStats } from '@interfaces/referral';
import { Statistic } from 'antd';
import { useIntl } from 'react-intl';
import style from './referral-stat.module.scss';

interface IProps {
  stats: IReferralStats
}

function ReferralStat({ stats }: IProps) {
  const intl = useIntl();
  return (
    <div className={style['starts-referral']}>
      <Statistic
        title={intl.formatMessage({ id: 'totalNetPrice', defaultMessage: 'Total Net Price' })}
        prefix="€"
        value={stats?.totalNetPrice || 0}
        precision={2}
      />
      <Statistic
        title={intl.formatMessage({ id: 'totalReferrals', defaultMessage: 'Total Referrals' })}
        value={stats?.totalRegisters || 0}
      />
      <Statistic
        title={intl.formatMessage({ id: 'totalSales', defaultMessage: 'Total Sales' })}
        value={stats?.totalSales || 0}
      />
    </div>
  );
}

export default ReferralStat;
