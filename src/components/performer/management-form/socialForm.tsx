/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import { AiOutlineClose } from 'react-icons/ai';
import { ITwitter } from '@interfaces/twitter';
import { twitterService } from '@services/twitter.service';
import { Button } from 'antd';
import Link from 'next/link';
import { useIntl } from 'react-intl';
import { useEffect, useState } from 'react';
import {
  FanslyIcon,
  InstagramIcon, OnlyFansIcon,
  TiktokIcon,
  XIcon
} from 'src/icons';
import { showError, showSuccess } from '@lib/message';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from './socialForm.module.scss';
import SocialFormItem from './socialFormItem';

export default function SocialForm() {
  const intl = useIntl();
  const { data: session } = useSession();
  const [account, setAccount] = useState<ITwitter>();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const orderSocials = [
    {
      key: 'instagram',
      icon: <InstagramIcon />,
      title: 'Instagram',
      subTitle: 'Username',
      defaultValue: session?.user?.socialLinks?.instagram
    },
    {
      key: 'tiktok',
      icon: <TiktokIcon />,
      title: 'Tiktok',
      subTitle: 'Username',
      defaultValue: session?.user?.socialLinks?.tiktok
    },
    {
      key: 'onlyFans',
      icon: <OnlyFansIcon />,
      title: 'OnlyFans',
      subTitle: 'Username',
      defaultValue: session?.user?.socialLinks?.onlyFans
    },
    {
      key: 'fansly',
      icon: <FanslyIcon />,
      title: 'Fansly',
      subTitle: 'Username',
      defaultValue: session?.user?.socialLinks?.fansly
    }
  ];

  const getAccount = async () => {
    setLoading(true);
    const resp: any = await twitterService.getAccount();
    resp ? setAccount(resp) : setAccount(null);
    setLoading(false);
  };

  const onGetLinkXActionClick = async () => {
    try {
      const resp: any = await twitterService.getLinkAuthoration();
      router.push(resp.url);
    } catch (error) {
      const e = await error;
      showError(
        e
        || intl.formatMessage({
          id: 'error.default',
          defaultMessage: 'Error occurred, please try again later'
        })
      );
    }
  };

  const onUnlinkXActionClick = async () => {
    try {
      setLoading(true);
      await twitterService.unLinkAuthoration();
      setAccount(null);
      showSuccess('Unlink successfully!');
      showSuccess(intl.formatMessage({ id: 'unlinkSuccessfully', defaultMessage: 'Unlink successfully' }));
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAccount();
  }, []);

  return (
    <div className={styles['form-group']}>
      <div className={styles['form-wrapper']}>
        <header className={styles['form-header']}>
          <p className={styles['form-title']}>
            {intl.formatMessage({ id: 'verifiedAccounts', defaultMessage: 'Verified Accounts' })}
          </p>
          <p className={styles['form-sub']}>
            {intl.formatMessage({ id: 'buildTrustWithYourNetworkByVerifyingYourSocialProfiles', defaultMessage: 'Build trust with your network by verifying your social profiles' })}
          </p>
        </header>
        <main className={styles['form-content']}>
          <div className={styles['form-item']}>
            <div className={styles['form-item-logo']}>
              <p>
                <XIcon />
              </p>
            </div>
            <div className={styles['form-item-content']}>
              <p className={styles['form-item-content-title']}>
                {intl.formatMessage({ id: 'twitter', defaultMessage: 'Twitter' })}
              </p>
              {
                account
                  ? (
                    <div className={styles['form-item-content-sub']}>
                      <p className={styles['form-item-content-sub-lable']}>
                        {intl.formatMessage({ id: 'yourURL:', defaultMessage: 'Your URL:' })}
                      </p>
                      <Link href="" className={styles['form-item-content-sub-link']}>
                        https://x.com/
                        {account?.userName}
                      </Link>
                    </div>
                  ) : (
                    <div className={styles['form-item-content-sub']}>
                      <p className={styles['form-item-content-sub-lable']}>
                        {intl.formatMessage({
                          id: 'youHaven\'tLinkedAnyAccount',
                          defaultMessage: 'You haven\'t linked any account'
                        })}
                      </p>
                    </div>
                  )
              }
            </div>
            <div className={styles['form-item-action']}>
              {
                !account
                  ? (
                    <Button onClick={onGetLinkXActionClick}>
                      {intl.formatMessage({ id: 'linkAccount', defaultMessage: 'Link Account' })}
                    </Button>
                  )
                  : (
                    <Button onClick={onUnlinkXActionClick}>
                      <AiOutlineClose />
                    </Button>
                  )
              }
            </div>
          </div>
        </main>
      </div>
      <div className={styles['form-wrapper']}>
        <header className={styles['form-header']}>
          <p className={styles['form-title']}>
            {intl.formatMessage({ id: 'ortherProfiles', defaultMessage: 'Orther Profiles' })}
          </p>
          <p className={styles['form-sub']}>
            {intl.formatMessage({ id: 'enterYourUsernameToAddTheseSocialAccountsToYourProfile', defaultMessage: 'Enter your username to add these social accounts to your profile' })}
          </p>
        </header>
        <main className={styles['form-content']}>
          {
            orderSocials.map((item) => (
              <SocialFormItem item={item} />
            ))
          }
        </main>
      </div>
    </div>
  );
}
