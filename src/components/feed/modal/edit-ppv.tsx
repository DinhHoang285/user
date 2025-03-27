'use client';

/* eslint-disable no-nested-ternary */
import { IUser } from '@interfaces/user';
import { showError } from '@lib/message';
import { performerService } from '@services/performer.service';
import {
  Avatar,
  Button, Form, Input, Modal,
  Select
} from 'antd';
import { debounce } from 'lodash';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { requestService } from 'src/services/request.service';
import style from './edit.module.scss';

function EditPPV({
  setIsModalOpen, isModalOpen, content
}: any) {
  const initialAuxiliary = {
    performers: [],
    vault: null
  };
  const intl = useIntl();
  const { data: session } = useSession();
  const user: IUser = session?.user as IUser;
  const [auxiliary, setAuxiliary] = useState(initialAuxiliary);
  const [tags, setTags] = useState(content.tags || []);
  const [participantIds, setParticipantIds] = useState(content.participantIds || []);

  const onFinish = async (values) => {
    const data = { ...values };
    data.sourceId = content._id;
    data.typeRequest = 'edit';
    data.participantIdsEdit = participantIds;
    data.tagsEdit = tags;

    try {
      if (!window.confirm(
        intl.formatMessage(
          { id: 'confirmEditContent', defaultMessage: 'Are you sure you want to edit this {mediaType}?' },
          { mediaType: content.mediaType }
        )
      )) return;
      await requestService.createRequest({ ...data }, content.mediaType);
      setIsModalOpen(false);
    } catch (error) {
      showError(intl.formatMessage({ id: 'errorOccuredTryAgain', defaultMessage: 'An error occurred while editing.' }));
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onChangeAuxiliary = (obj) => {
    setAuxiliary((prev) => ({ ...prev, ...obj }));
  };

  const getPerformers = debounce(async (q, performerIds = []) => {
    try {
      const resp = await performerService.search({
        q,
        performerIds: performerIds || [],
        limit: 99
      });
      onChangeAuxiliary({ performers: resp.data.data });
    } catch (e) {
      showError(e);
    }
  }, 500);

  useEffect(() => {
    getPerformers('', content?.participantIds || [user._id]);
  }, []);

  return (
    <Modal
      title={intl.formatMessage({ id: 'editContent', defaultMessage: 'Edit Content' })}
      open={isModalOpen}
      footer={false}
      onCancel={handleCancel}
    >
      <div className={style.container}>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{
            titleEdit: content?.title || content.text || content.name,
            descriptionEdit: content?.description || content?.stock
          }}
          onFinish={onFinish}
          autoComplete="off"
        >

          <div className={style['box-input']}>
            <p>
              {content.mediaType === 'product'
                ? intl.formatMessage({ id: 'name', defaultMessage: 'Name' })
                : (
                  (content.mediaType !== 'feed' && content.isSale !== false && content.price !== 0)
                    || (content.mediaType === 'feed' && content.isSale === false && content.price === 0 && content.type === 'audio')
                    ? intl.formatMessage({ id: 'title', defaultMessage: 'Title' })
                    : intl.formatMessage({ id: 'text', defaultMessage: 'Text' })
                )}
            </p>
            <Form.Item
              name="titleEdit"
              rules={[{ required: true, message: intl.formatMessage({ id: 'titleEditRequired', defaultMessage: 'Please input your title edit!' }) }]}
            >
              <Input />
            </Form.Item>
          </div>
          {(
            (['gallery', 'video', 'short'].includes(content.mediaType))
            || (['product'].includes(content.mediaType) && content.type === 'physical')
            || (['feed'].includes(content.mediaType) && content.type === 'sound-audio')
          ) && (
            <div className={style['box-input']}>
              <p>
                {content.mediaType === 'product'
                  ? intl.formatMessage({ id: 'stock', defaultMessage: 'Stock' })
                  : intl.formatMessage({ id: 'description', defaultMessage: 'Description' })}
              </p>
              <Form.Item
                name="descriptionEdit"
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage(
                      {
                        id: 'descriptionEditRequired',
                        defaultMessage: 'Please input your {field} edit!'
                      },
                      { field: content.mediaType === 'product' ? intl.formatMessage({ id: 'stock', defaultMessage: 'stock' }) : intl.formatMessage({ id: 'description', defaultMessage: 'description' }) }
                    )
                  }
                ]}
              >
                <Input />
              </Form.Item>
            </div>
          )}
          {(
            (['gallery', 'video', 'short'].includes(content.mediaType))
            || (['feed'].includes(content.mediaType) && content.type === 'sound-audio')
          ) && (
            <div>
              <div className={style['box-input']}>
                <Form.Item
                  required
                  className={style['attach-media']}
                  validateTrigger={['onChange', 'onBlur']}
                >
                  <p className={style['form-item-title']}>
                    {intl.formatMessage({
                      id: 'participiants',
                      defaultMessage: 'Participants'
                    })}
                  </p>
                  <div className={style['input-f-desc']}>
                    <Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      showSearch
                      placeholder={intl.formatMessage({
                        id: 'searchCreatorHere',
                        defaultMessage: 'Search creator here'
                      })}
                      optionFilterProp="children"
                      onSearch={(q) => getPerformers(q)}
                      loading={false}
                      defaultValue={content.participantIds}
                      onChange={(val) => setParticipantIds(val)}
                    >
                      {auxiliary.performers
                        && auxiliary.performers.length > 0
                        && auxiliary.performers.map((p) => (
                          <Select.Option key={p?._id} value={p?._id}>
                            <Avatar src={p?.avatar || '/no-avatar.jpg'} />
                            {' '}
                            {p?.name || p?.username || 'N/A'}
                          </Select.Option>
                        ))}
                    </Select>
                  </div>
                </Form.Item>
              </div>
              <div className={style['box-input']}>
                <Form.Item
                  required
                  className={style['attach-media']}
                  validateTrigger={['onChange', 'onBlur']}
                >
                  <p className={style['form-item-title']}>
                    {intl.formatMessage({ id: 'tags', defaultMessage: 'Tags' })}
                  </p>
                  <div className={style['input-f-desc']}>
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      size="middle"
                      defaultValue={tags}
                      onChange={(val) => setTags(val)}
                    />
                  </div>
                </Form.Item>
              </div>
            </div>
          )}

          <div className={style['box-input']}>
            <p>
              {intl.formatMessage({ id: 'reason', defaultMessage: 'Reason?' })}
              ?
            </p>
            <Form.Item
              name="reason"
              rules={[
                { required: true, message: intl.formatMessage({ id: 'reasonRequired', defaultMessage: 'Please enter reason!' }) }
              ]}
            >
              <Input.TextArea rows={3} />
            </Form.Item>
          </div>

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              {intl.formatMessage({ id: 'submit', defaultMessage: 'Submit' })}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}

export default EditPPV;
