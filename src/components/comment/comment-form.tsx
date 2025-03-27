'use client';

import { AiOutlineSmile } from 'react-icons/ai';
import { showError, showSuccess } from '@lib/message';
import { commentService } from '@services/comment.service';
import {
  Button, Form, Popover, Input
} from 'antd';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { ICreateComment } from 'src/interfaces/comment';
import { useMainThemeLayout } from 'src/providers/main-layout.provider';
import { useSession } from 'next-auth/react';
import { IUser } from '@interfaces/user';
import style from './comment-form.module.scss';

const Emotions = dynamic(() => import('@components/common/emotions'), {
  ssr: false,
  loading: () => (
    <div className="skeleton-loading" style={{ width: 300, height: 400 }} />
  )
});

type Props = {
  objectId: string;
  objectType: string;
  onSuccess: Function;
  isReply?: boolean;
};

export default function CommentForm({
  objectId,
  objectType,
  isReply = false,
  onSuccess = () => { }
}: Props) {
  const intl = useIntl();
  const { data: session } = useSession();
  const user: IUser = session?.user as any;
  const [formRef] = Form.useForm();
  const [submiting, setsubmiting] = useState(false);
  const { setLoginModal } = useMainThemeLayout();
  // fake data
  const loggedIn = user?._id;

  return (
    <Form
      form={formRef}
      name="comment-form"
      onFinish={async (values: ICreateComment) => {
        try {
          const data = { ...values };
          if (!loggedIn) {
            setLoginModal({ openForm: 'login' });
            return;
          }
          if (!data.content) {
            showError(intl.formatMessage({ id: 'pleaseAddAComment', defaultMessage: 'Please add a comment!' }));
            return;
          }
          if (data.content.length > 250) {
            showError(intl.formatMessage({ id: 'commentCannotOver', defaultMessage: 'Comment cannot be over 250 characters' }));
            return;
          }
          setsubmiting(true);
          data.objectId = objectId;
          data.objectType = objectType || 'video';
          const res = await commentService.create(data);
          formRef.resetFields();
          onSuccess({ ...res.data, isAuth: true });
          showSuccess(intl.formatMessage({ id: 'commentedSuccessfully', defaultMessage: 'Commented successfully' }));
        } catch (e) {
          showError(e);
        } finally {
          setsubmiting(false);
        }
      }}
      initialValues={{
        content: ''
      }}
    >
      <div className={style['comment-form']}>
        <div className="cmt-area">
          <Form.Item name="content">
            <Input.TextArea
              maxLength={250}
              showCount
              minLength={1}
              rows={!isReply ? 2 : 1}
              placeholder={!isReply ? intl.formatMessage({ id: 'message', defaultMessage: 'Message' }) : intl.formatMessage({ id: 'addAReplyHere', defaultMessage: 'Add a reply here' })}
            />
          </Form.Item>
          <Popover
            key={objectId}
            className="emotion-popover"
            content={(
              <Emotions onEmojiClick={async (emoji) => {
                if (!loggedIn) return;
                formRef.setFieldsValue({
                  content: `${formRef.getFieldValue('content') || ''} ${emoji} `
                });
              }}
              />
            )}
            title={null}
            trigger="click"
          >
            <button type="button" className="grp-emotions">
              <span>
                <AiOutlineSmile style={{
                  color: '#09B3F2'
                }}
                />
              </span>
            </button>
          </Popover>
        </div>
      </div>
      <div className={style['comment-form-footer']}>
        <Button
          className={!isReply ? style['reset-btn'] : ''}
          htmlType="reset"
          disabled={!loggedIn || submiting}
        >
          {intl.formatMessage({ id: 'cancel', defaultMessage: 'Cancel' })}
        </Button>
        <Button
          className={!isReply ? style['submit-btn'] : ''}
          htmlType="submit"
          disabled={submiting}
        >
          {!isReply ? intl.formatMessage({ id: 'send', defaultMessage: 'Send' }) : intl.formatMessage({ id: 'reply', defaultMessage: 'Reply' })}
        </Button>
      </div>
    </Form>
  );
}
