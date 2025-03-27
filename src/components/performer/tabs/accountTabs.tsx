'use client';

import { message, Tabs } from 'antd';
import { useEffect } from 'react';
import { IPerformer } from '@interfaces/performer';
import { IPerformerCategory } from '@interfaces/performer-category';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useIntl } from 'react-intl';
import { useMedia } from 'react-use';
import SecureForm from '../management-form/secureForm';
import style from './tabs.module.scss';

const PerformerAccountForm = dynamic(() => import('@components/performer/management-form/accountForm'));
const AutoMessageForm = dynamic(() => import('@components/performer/management-form/auto-message'), { ssr: false });
const SocialForms = dynamic(() => import('@components/performer/management-form/socialForm'), { ssr: false });
const PerformerSubscriptionForm = dynamic(() => import('@components/performer/management-form/subscriptionForm'), { ssr: false });
const PerformerVerificationForm = dynamic(() => import('@components/performer/management-form/verificationForm'), { ssr: false });
const PerformerAdvertisementForm = dynamic(() => import('@components/performer/management-form/advertisementForm'), { ssr: false });

interface IProps {
  categories: IPerformerCategory[];
}

function AccountSettingsTabs({
  categories
}: IProps) {
  const intl = useIntl();
  const searchParams = useSearchParams();
  const isMobile = useMedia('(max-width: 768px)');
  const { data: session } = useSession();
  const currentUser: IPerformer = session?.user as IPerformer;

  useEffect(() => {
    const msg = searchParams.get('msg');
    if (msg) message.info(msg);
  }, []);

  const tabItems = [
    {
      key: 'basic',
      label: isMobile
        ? intl.formatMessage({ id: 'settings', defaultMessage: 'Settings' })
        : intl.formatMessage({ id: 'basicSettings', defaultMessage: 'Basic Settings' }),
      children: (
        <PerformerAccountForm
          user={currentUser as IPerformer}
          categories={categories}
        />
      )
    },
    {
      key: 'verification',
      label: isMobile
        ? intl.formatMessage({ id: 'documents', defaultMessage: 'Documents' })
        : intl.formatMessage({ id: 'idDocuments', defaultMessage: 'ID Documents' }),
      children: <PerformerVerificationForm user={currentUser as IPerformer} />
    },
    {
      key: 'subscription',
      label: isMobile
        ? intl.formatMessage({ id: 'pricing', defaultMessage: 'Pricing' })
        : intl.formatMessage({ id: 'pricingSettings', defaultMessage: 'Pricing Settings' }),
      children: <PerformerSubscriptionForm user={currentUser as IPerformer} />
    },
    {
      key: 'message',
      label: isMobile
        ? intl.formatMessage({ id: 'autoMessageMobile', defaultMessage: 'Auto Message' })
        : intl.formatMessage({ id: 'autoMessage', defaultMessage: 'Auto Message' }),
      children: <AutoMessageForm user={currentUser as any} />
    },
    {
      key: 'secure',
      label: isMobile
        ? intl.formatMessage({ id: 'security', defaultMessage: 'Security' })
        : intl.formatMessage({ id: 'secureSettings', defaultMessage: 'Secure Settings' }),
      children: <SecureForm />
    },
    {
      key: 'social',
      label: isMobile
        ? intl.formatMessage({ id: 'socials', defaultMessage: 'Socials' })
        : intl.formatMessage({ id: 'socialSettings', defaultMessage: 'Social Settings' }),
      children: <SocialForms />
    },
    {
      key: 'advertisement',
      label: isMobile
        ? intl.formatMessage({ id: 'advertisements', defaultMessage: 'Advertisements' })
        : intl.formatMessage({ id: 'advertisementSettings', defaultMessage: 'Advertisement Settings' }),
      children: <PerformerAdvertisementForm />
    }
  ];

  return (
    <>
      {!currentUser?.verifiedDocument && (
        <div className="verify-info">
          {intl.formatMessage({
            id: 'yourIdDocumentsAreNot',
            defaultMessage: 'Your ID documents are not verified yet! You could not post any content right now.'
          })}
          <p>
            {intl.formatMessage({
              id: 'ifYouHaveAnyQuestion',
              defaultMessage: 'If you have any question, please contact our administrator to get more information.'
            })}
          </p>
        </div>
      )}
      <div className={style.account_tabs}>
        <Tabs
          items={tabItems}
          defaultActiveKey="basic"
          tabPosition="top"
          renderTabBar={(props, TabNavList) => <TabNavList {...props} mobile={false} />}
        />
      </div>
    </>
  );
}

export default AccountSettingsTabs;
