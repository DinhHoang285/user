'use client';

import { showError, showSuccess } from '@lib/message';
import { payoutRequestService } from '@services/index';
import { Tabs } from 'antd';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useSession } from 'next-auth/react';
import styles from './tabs.module.scss';

const PerformerBankingForm = dynamic(() => import('@components/performer/management-form/banking-form'));
const PerformerPaypalForm = dynamic(() => import('@components/performer/management-form/paypalForm'), { ssr: false });

function BankingSettingsTabs() {
  const { data: session, update } = useSession();
  const [submiting, setsubmiting] = useState(false);
  const [tab, setTab] = useState('banking');
  const intl = useIntl();

  const handleUpdatePaypal = async (data) => {
    try {
      setsubmiting(true);
      const resp = await payoutRequestService.updatePayoutMethod('paypal', data);
      update({ info: { ...session.user, paypalSetting: resp.data } });
      showSuccess(intl.formatMessage({ id: 'paypalAccountWasUpdated', defaultMessage: 'Paypal account was updated successfully!' }));
    } catch (e) {
      showError(e);
    } finally {
      setsubmiting(false);
    }
  };

  const handleUpdateBanking = async (data) => {
    try {
      setsubmiting(true);
      const resp = await payoutRequestService.updatePayoutMethod('banking', data);
      update({ info: { ...session.user, bankingInformation: resp.data } });
      showSuccess(intl.formatMessage({ id: 'bankingAccountWasUpdated', defaultMessage: 'Banking account was updated successfully!' }));
    } catch (e) {
      showError(e);
    } finally {
      setsubmiting(false);
    }
  };

  const items = [
    {
      key: 'banking',
      label: (
        <div style={{ display: 'inline-flex', alignItems: 'center' }}>
          <Image
            src="/banking-ico.png"
            alt="banking-icon"
            height={40}
            width={50}
            quality={30}
            priority
            style={{ height: 40, width: 'auto' }}
          />
          &nbsp;
          {intl.formatMessage({ id: 'bankTransfer', defaultMessage: 'Bank Transfer' })}
        </div>
      ),
      children: (
        tab === 'banking' && (
          <PerformerBankingForm
            onFinish={(data) => handleUpdateBanking(data)}
            updating={submiting}
            user={session?.user}
          />
        )
      )
    },
    {
      key: 'paypal',
      label: (
        <Image
          src="/paypal-ico.png"
          alt="paypal-icon"
          height={40}
          width={50}
          quality={30}
          priority
          style={{ height: 40, width: 'auto' }}
        />
      ),
      children: (
        tab === 'paypal' && (
          <PerformerPaypalForm
            onFinish={(data) => handleUpdatePaypal(data)}
            updating={submiting}
            user={session?.user}
          />
        )
      )
    }
  ];

  return (
    <Tabs
      className={styles.container}
      onChange={(e) => setTab(e)}
      items={items}
    />
  );
}

export default BankingSettingsTabs;
