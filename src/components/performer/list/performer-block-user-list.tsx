'use client';

import UsersBlockList from '@components/user/users-block-list';
import {
  Button, Form, Input, Modal
} from 'antd';
import React, { useEffect, useState } from 'react';
import { blockService } from 'src/services';
import { showError, showSuccess } from '@lib/message';
import { SelectUserDropdown } from '@components/user';
import { useIntl } from 'react-intl';
import style from './performer-block-user.module.scss';

function PerformerBlockList() {
  const intl = useIntl();
  const limit = 10;
  const [loading, setLoading] = useState(false);
  const [submiting, setSubmiting] = useState(false);
  const [offset, setOffset] = useState(0);
  const [userBlockedList, setUserBlockedList] = useState([]);
  const [totalBlockedUsers, setTotalBlockedUsers] = useState(0);
  const [openBlockModal, setOpenBlockModal] = useState(false);
  const [formRef] = Form.useForm();

  const getBlockList = async () => {
    try {
      setLoading(true);
      const resp = await blockService.getBlockListUsers({
        limit,
        offset: offset * limit
      });
      setUserBlockedList(resp.data.data);
      setTotalBlockedUsers(resp.data.total);
    } catch (e) {
      showError(e);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (data) => {
    setOffset(data.current - 1);
  };

  const handleUnblockUser = async (userId: string) => {
    if (
      !window.confirm(
        intl.formatMessage({
          id: 'areYouSureToUnblock',
          defaultMessage: 'Are you sure to unblock this user?'
        })
      )
    ) return;
    try {
      setSubmiting(true);
      await blockService.unBlockUser(userId);
      showSuccess(
        intl.formatMessage({
          id: 'unblockedSuccessfully',
          defaultMessage: 'Unblocked successfully'
        })
      );
      setUserBlockedList(userBlockedList.filter((u) => u.targetId !== userId));
    } catch (e) {
      showError(e);
    } finally {
      setSubmiting(false);
    }
  };

  const handleBlockUser = async (data) => {
    const { reason, targetId } = data;
    try {
      setSubmiting(true);
      await blockService.blockUser({ targetId, target: 'user', reason });
      showSuccess(
        intl.formatMessage({
          id: 'userProfileIsBlockded',
          defaultMessage: 'User profile is blocked successfully'
        })
      );
      getBlockList();
    } catch (e) {
      showError(e);
    } finally {
      setSubmiting(false);
      setOpenBlockModal(false);
    }
  };

  useEffect(() => {
    getBlockList();
  }, [offset]);

  return (
    <>
      <div className={style['block-user']}>
        <button
          className={style['block-button']}
          type="button"
          onClick={() => setOpenBlockModal(true)}
        >
          {intl.formatMessage({
            id: 'wantToBlockSomeOne',
            defaultMessage: 'Want to block someone, click here!'
          })}
        </button>
      </div>
      <div className="users-blocked-list">
        <UsersBlockList
          items={userBlockedList}
          searching={loading}
          total={totalBlockedUsers}
          onPaginationChange={(data) => handleTabChange(data)}
          pageSize={limit}
          submiting={submiting}
          unblockUser={(userId) => handleUnblockUser(userId)}
        />
      </div>
      {openBlockModal && (
        <div className={style['block-modal']}>
          <Modal
            centered
            title={intl.formatMessage({
              id: 'blockUser',
              defaultMessage: 'Block user'
            })}
            open={openBlockModal}
            onCancel={() => setOpenBlockModal(false)}
            footer={null}
            destroyOnClose
          >
            <Form
              form={formRef}
              name="blockForm"
              onFinish={(data) => handleBlockUser(data)}
              initialValues={{ reason: '' }}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              className="account-form"
            >
              <Form.Item
                name="targetId"
                label={intl.formatMessage({
                  id: 'pleaseEnterTheUserName',
                  defaultMessage: 'Please enter the username you want to block'
                })}
              >
                <SelectUserDropdown
                  onSelect={(id) => formRef.setFieldValue('targetId', id)}
                />
              </Form.Item>
              <Form.Item
                name="reason"
                label={intl.formatMessage({
                  id: 'reason',
                  defaultMessage: 'Reason'
                })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'tellUsYourReason',
                      defaultMessage: 'Tell us your reason'
                    })
                  }
                ]}
              >
                <Input.TextArea
                  placeholder={intl.formatMessage({
                    id: 'enterYourReason',
                    defaultMessage: 'Enter your reason'
                  })}
                />
              </Form.Item>
              <div className={style['block-modal-footer']}>
                <Form.Item>
                  <Button
                    className="primary"
                    htmlType="submit"
                    loading={submiting}
                    disabled={submiting}
                    style={{ marginRight: '20px' }}
                  >
                    {intl.formatMessage({
                      id: 'submit',
                      defaultMessage: 'Submit'
                    })}
                  </Button>
                  <button
                    type="button"
                    className={style['close-button']}
                    onClick={() => setOpenBlockModal(false)}
                  >
                    {intl.formatMessage({
                      id: 'close',
                      defaultMessage: 'Close'
                    })}
                  </button>
                </Form.Item>
              </div>
            </Form>
          </Modal>
        </div>
      )}
    </>
  );
}

export default PerformerBlockList;
