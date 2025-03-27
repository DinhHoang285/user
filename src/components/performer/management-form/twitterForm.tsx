/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import { AiOutlineClose, AiOutlineTwitter } from 'react-icons/ai';
import { ITwitter } from '@interfaces/twitter';
import { twitterService } from '@services/twitter.service';
import { Button } from 'antd';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { showError, showSuccess } from '@lib/message';
import { useRouter } from 'next/navigation';
import styles from './twitterForm.module.scss';

export default function TwitterForm() {
  const [account, setAccount] = useState<ITwitter>();
  const [loading, setLoading] = useState(true);
  const intl = useIntl();

  const router = useRouter();

  const getAccount = async () => {
    setLoading(true);
    const resp: any = await twitterService.getAccount();
    setAccount(resp);
    setLoading(false);
  };
  const onGetLinkActionClick = async () => {
    try {
      const resp: any = await twitterService.getLinkAuthoration();
      router.push(resp.url);
    } catch (error) {
      throw new Error(error);
    }
  };
  const onUnlinkActionClick = async () => {
    try {
      setLoading(true);
      await twitterService.unLinkAuthoration();
      setAccount(null);
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
    <div className={styles['form-wrapper']}>
      <header className={styles['form-header']}>
        <p className={styles['form-title']}>
          {intl.formatMessage({ id: 'twitterProfiles', defaultMessage: 'Twitter Profiles' })}
        </p>
        <p className={styles['form-sub']}>
          {intl.formatMessage({ id: 'addTheseSocialAccountsToYourProfile', defaultMessage: 'Add these social accounts to your profile' })}
        </p>
      </header>
      <main className={styles['form-content']}>
        <div className={styles['form-item']}>
          <div className={styles['form-item-logo']}>
            <p>
              <AiOutlineTwitter />
            </p>
          </div>
          <div className={styles['form-item-content']}>
            <p className={styles['form-item-content-title']}>{intl.formatMessage({ id: 'twitter', defaultMessage: 'Twitter' })}</p>
            {
              account
                ? (
                  <div className={styles['form-item-content-sub']}>
                    <p className={styles['form-item-content-sub-lable']}>
                      {intl.formatMessage({ id: 'yourDribbbleURL:', defaultMessage: 'Your Dribbble URL:' })}
                    </p>
                    <Link href="" className={styles['form-item-content-sub-link']}>
                      https://x.com/
                      {account.userName}
                    </Link>
                  </div>
                ) : (
                  <div className={styles['form-item-content-sub']}>
                    <p className={styles['form-item-content-sub-lable']}>
                      {intl.formatMessage({ id: 'You haven\'t link with any account', defaultMessage: 'You haven\'t link with any account' })}
                    </p>
                  </div>
                )
            }
          </div>
          <div className={styles['form-item-action']}>
            {
              !account
                ? <Button onClick={onGetLinkActionClick}>{intl.formatMessage({ id: 'linkAccount', defaultMessage: 'Link Account' })}</Button>
                : (
                  <Button onClick={onUnlinkActionClick}>
                    <AiOutlineClose />
                  </Button>
                )
            }
          </div>
        </div>
      </main>
    </div>
  );
}
