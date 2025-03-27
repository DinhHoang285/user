'use client';

/* eslint-disable no-unsafe-optional-chaining */
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { IReferralStats } from '@interfaces/referral';
import { IUser } from '@interfaces/user';
import { showError } from '@lib/message';
import { earningService } from '@services/earning.service';
import { referralService } from '@services/referral.service';
import {
  Divider,
  Popover, Tabs, TabsProps
} from 'antd';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useMainThemeLayout } from 'src/providers/main-layout.provider';
import style from './referral.module.scss';

const TableListReferralUser = dynamic(() => import('@components/referral/referral-user-table'));
const TableListReferralEarning = dynamic(() => import('@components/referral/referral-earning-table'));
const ReferralStat = dynamic(() => import('@components/referral/referral-stat'));
const ReferralLink = dynamic(() => import('@components/referral/referral-link'));

function ReferralPage() {
  const intl = useIntl();
  const { settings } = useMainThemeLayout();
  const { data: session } = useSession();
  const user: IUser = session?.user as IUser;
  const router = useRouter();
  // Referral link
  const [referralLoading, setReferralLoading] = useState(false);
  const [linkReferral, setLinkReferral] = useState('');
  const [referralCode, setReferralCode] = useState('');
  // Referral stat
  const [stats, setStats] = useState<IReferralStats>();
  // Referral earning
  const [earningLoading, setEarningLoading] = useState(false);
  const [listEarnings, setListEarnings] = useState([]);
  const [filterEarning] = useState({} as any);
  const [paginationEarning, setPaginationEarning] = useState({} as any);
  const [earningSortBy, setEarningSortBy] = useState('createdAt');
  const [earningSort, setEarningSort] = useState('desc');
  // Referral user
  const [usersLoading, setUsersLoading] = useState(false);
  const [listUsers, setListUsers] = useState([]);
  const [filterUser] = useState({} as any);
  const [paginationUser, setPaginationUser] = useState({} as any);
  const [usersSortBy, setUsersSortBy] = useState('createdAt');
  const [usersSort, setUsersSort] = useState('desc');

  const [limit] = useState(10);

  const getReferralCode = async () => {
    try {
      setReferralLoading(true);
      const resp = await referralService.getReferralCode();
      setLinkReferral(`${window.location.origin}/register?rel=${resp.data}`);
      setReferralCode(resp.data);
    } catch (e) {
      showError(e);
    } finally {
      setReferralLoading(false);
    }
  };

  const getUserStat = async () => {
    try {
      const resp = await earningService.referralStats();
      setStats(resp.data);
    } catch (e) {
      showError(e);
    }
  };

  const referralEarningSearch = async (page = 1) => {
    try {
      setEarningLoading(true);
      const resp = await earningService.referralSearch({
        ...filterEarning,
        limit,
        offset: (page - 1) * limit,
        sort: earningSort,
        sortBy: earningSortBy
      });
      setListEarnings(resp.data.data);
      setPaginationEarning({ ...paginationEarning, total: resp.data.total, pageSize: limit });
    } catch (e) {
      showError(e);
    } finally {
      setEarningLoading(false);
    }
  };

  const referralUserSearch = async (page = 1) => {
    try {
      setUsersLoading(true);
      const resp = await referralService.search({
        ...filterUser,
        limit,
        offset: (page - 1) * limit,
        sort: usersSort,
        sortBy: usersSortBy
      });
      setListUsers(resp.data.data);
      setPaginationUser({ ...paginationUser, total: resp.data.total, pageSize: limit });
    } catch (e) {
      showError(e);
    } finally {
      setUsersLoading(false);
    }
  };

  const handleTableEarningChange = (pagination, filter, sorter) => {
    const pager = { ...paginationEarning };
    pager.current = pagination.current;
    setPaginationEarning(pager);
    setEarningSortBy(sorter.field || 'createdAt');
    // eslint-disable-next-line no-nested-ternary
    setEarningSort(sorter.order ? sorter.order === 'descend' ? 'desc' : 'asc' : 'desc');
    referralEarningSearch(pager.current);
  };

  const handleTableUserChange = (pagination, filter, sorter) => {
    const pager = { ...paginationUser };
    pager.current = pagination.current;
    setPaginationUser(pager);
    setUsersSortBy(sorter.field || 'createdAt');
    // eslint-disable-next-line no-nested-ternary
    setUsersSort(sorter.order ? sorter.order === 'descend' ? 'desc' : 'asc' : 'desc');
    referralUserSearch(pager.current);
  };

  const handlePageChange = async (key: string) => {
    if (key === 'earning') {
      referralEarningSearch();
    }
    if (key === 'users') {
      referralUserSearch();
    }
  };

  const content = (
    <div>
      <p className={style['referal-content']}>
        {intl.formatMessage({ id: 'referAModelGetPersent', defaultMessage: `Refer a model - get ${settings?.performerReferralCommission * 100 || 0}% on the model revenue for 1 year` }, { persent: settings?.performerReferralCommission * 100 || 0 })}
      </p>
      <p className={style['referal-content']}>
        {intl.formatMessage({ id: 'referAFanGetPersent', defaultMessage: `Refer a fan - get ${settings?.userReferralCommission * 100 || 0}% on the fan spends` }, { persent: settings?.userReferralCommission * 100 || 0 })}
      </p>
    </div>
  );

  const tabItem: TabsProps['items'] = [
    {
      key: 'users',
      label: 'Referred Person List',
      children: paginationUser.total ? (
        <TableListReferralUser
          rowKey="_id"
          dataSource={listUsers}
          loading={usersLoading}
          onChange={handleTableUserChange}
          pagination={paginationUser}
        />
      ) : <p className={style['referal-no-found']}>{intl.formatMessage({ id: 'noReferralsWereFound', defaultMessage: 'No referrals were found' })}</p>
    },
    {
      key: 'earning',
      label: 'Commission List',
      children: paginationEarning.total ? (
        <TableListReferralEarning
          rowKey="_id"
          dataSource={listEarnings}
          loading={earningLoading}
          onChange={handleTableEarningChange}
          pagination={paginationEarning}
        />
      ) : <p className={style['referal-no-found']}>{intl.formatMessage({ id: 'noRevenueWasFound', defaultMessage: 'No revenue was found' })}</p>
    }
  ];

  useEffect(() => {
    getReferralCode();
    getUserStat();
    referralUserSearch();
  }, []);

  useEffect(() => {
    if (!user?.isPerformer) {
      router.push('/404');
    }
  }, []);

  return (
    <div className="main-container">
      <div className={style['page-referral']}>
        <div className={style.title}>
          <h1>{intl.formatMessage({ id: 'referAFriend', defaultMessage: 'Refer A Friend' })}</h1>
          <div className={style.info}>
            <p>{intl.formatMessage({ id: 'forEachFriendYouRefer', defaultMessage: 'For each friend you refer you will get commission' })}</p>
            <Popover content={content}>
              <span>
                <AiOutlineInfoCircle />
              </span>
            </Popover>
          </div>
        </div>
        <div className={style['page-referral-link']}>
          <ReferralLink linkReferral={linkReferral} referralCode={referralCode} loading={referralLoading} />
        </div>
        <Divider />
        <ReferralStat stats={stats} />
        <Tabs defaultActiveKey="users" items={tabItem} onChange={handlePageChange} />
      </div>
    </div>
  );
}

export default ReferralPage;
