'use client';

/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/button-has-type */
import { AiOutlineClose } from 'react-icons/ai';
import { showError } from '@lib/message';
import { performerService } from '@services/performer.service';
import { Button } from 'antd';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import styles from './socialForm.module.scss';

interface IProps {
  item: any
}
function SocialFormItem({ item }: IProps) {
  const intl = useIntl();
  const { data: session, update: updateUser } = useSession();
  const [appState, setAppState] = useState({
    value: item.defaultValue || '',
    defaultValue: item.defaultValue || '',
    open: false,
    loading: false
  });
  const onChangeAppState = (obj) => {
    setAppState((prev) => ({ ...prev, ...obj }));
  };
  const openFormActionClick = () => {
    onChangeAppState({ open: true });
  };
  const closeFormActionClick = () => {
    onChangeAppState({ open: false });
  };
  const onChangeInput = (event) => {
    onChangeAppState({ value: event.target.value });
  };
  const onSaveItemActionCLick = async () => {
    try {
      onChangeAppState({ loading: true });
      const resp = await performerService.updateSocialLink({
        social: item.key,
        link: appState.value
      });
      updateUser({ info: { ...session?.user, ...resp.data } });
    } catch (error) {
      const e = await error;
      showError(
        e
        || intl.formatMessage({
          id: 'error.default',
          defaultMessage: 'Error occurred, please try again later'
        })
      );
    } finally {
      onChangeAppState({ loading: false, open: false });
    }
  };
  const onUnlinkItemActionClick = async () => {
    try {
      onChangeAppState({ loading: true });
      const resp = await performerService.unLinkSocial(item.key);
      updateUser({ info: { ...session?.user, ...resp.data } });
    } catch (error) {
      const e = await error;
      showError(
        e
        || intl.formatMessage({
          id: 'error.default',
          defaultMessage: 'Error occurred, please try again later'
        })
      );
    } finally {
      onChangeAppState({ loading: false, open: false });
    }
  };

  return (
    <div className={styles['form-item']}>
      <div className={styles['form-item-logo']}>
        <p>
          {item.icon}
        </p>
      </div>
      <div className={styles['form-item-content']}>
        <p className={styles['form-item-content-title']}>{item.title}</p>
        <div className={styles['form-item-content-sub']}>
          {
            item.defaultValue
              ? (
                <div className={styles['form-item-content-sub']}>
                  <p className={styles['form-item-content-sub-lable']}>
                    {intl.formatMessage({ id: 'yourURL:', defaultMessage: 'Your URL:' })}
                  </p>
                  <a href={item.defaultValue} className={styles['form-item-content-sub-link']}>
                    {item.defaultValue}
                  </a>
                </div>
              ) : (
                <div className={styles['form-item-content-sub']}>
                  <p className={styles['form-item-content-sub-lable']}>
                    {intl.formatMessage({ id: 'youHaven\'tLinkWithAnyAccount', defaultMessage: 'You haven\'t link with any account' })}
                  </p>
                </div>
              )
          }
        </div>
      </div>
      <div className={styles['form-item-action']}>
        {
          appState.open
            ? (
              <div className={styles['edit-form']}>
                <input type="text" className={styles['edit-form-input']} value={appState.value} onChange={onChangeInput} />
                <div className={styles['edit-form-action']}>
                  <Button loading={appState.loading} disabled={appState.loading} className={styles['edit-form-action-save']} onClick={onSaveItemActionCLick}>
                    {intl.formatMessage({ id: 'save', defaultMessage: 'Save' })}
                  </Button>
                  <button className={styles['edit-form-action-close']} onClick={closeFormActionClick}>
                    <AiOutlineClose />
                  </button>
                </div>
              </div>
            )
            : (
              <Button onClick={openFormActionClick}>
                {item.defaultValue
                  ? intl.formatMessage({
                    id: 'edit',
                    defaultMessage: 'Edit'
                  })
                  : intl.formatMessage({
                    id: 'link',
                    defaultMessage: 'Link'
                  })}
              </Button>
            )
        }
        {
          !!item?.defaultValue?.length && !appState.open
          && (
            <button className={styles['form-item-action-unlink']} onClick={onUnlinkItemActionClick}>
              <AiOutlineClose />
            </button>
          )
        }
      </div>
    </div>
  );
}

SocialFormItem.propTypes = {};

export default SocialFormItem;
