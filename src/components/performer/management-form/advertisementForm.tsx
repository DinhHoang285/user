'use client';

import { daysUntil } from '@lib/date';
import { showError, showSuccess, validateMessages } from '@lib/message';
import { performerService } from '@services/performer.service';
import {
  Button, Col, Divider, Form, Row, Switch
} from 'antd';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { IUser } from 'src/interfaces';
import { useMainThemeLayout } from 'src/providers/main-layout.provider';
import { useIntl } from 'react-intl';
import style from './subscriptionForm.module.scss';

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

export default function PerformerAdvertisementForm() {
  const { data: session, update: updateUser } = useSession();
  const user: IUser = session?.user as IUser;
  const { settings } = useMainThemeLayout();
  const [updating, setUpdating] = useState(false);
  const intl = useIntl();

  const handleUpdatePerformer = async (payload) => {
    const { _id } = payload;
    try {
      setUpdating(true);
      const updated = await performerService.updateMe(_id, payload);
      updateUser({ info: { ...session?.user, acceptAdInProfile: updated.data.acceptAdInProfile } });
      showSuccess(intl.formatMessage({ id: 'changessaved', defaultMessage: 'Changes saved' }));
    } catch (e) {
      showError(e);
    } finally {
      setUpdating(false);
    }
  };

  const submit = (data: any) => {
    handleUpdatePerformer({
      ...user,
      ...data
    });
  };

  return (
    <Form
      {...layout}
      name="nest-messages"
      onFinish={(values) => submit(values)}
      validateMessages={validateMessages}
      initialValues={user}
      labelAlign="left"
      className={style['subscription-form']}
      scrollToFirstError
    >
      <Row>
        <Col xl={12} md={12} xs={24}>
          <Form.Item
            label={intl.formatMessage({ id: 'acceptAdvertisement', defaultMessage: 'Accept Advertisement' })}
            name="acceptAdInProfile"
            valuePropName="checked"
            extra={(
              <p>
                {intl.formatMessage({
                  id: 'advertisementProfileInfo',
                  defaultMessage:
                    'If enabled, advertisement will be shown in your profile. You will get higher commission'
                })}
              </p>
            )}
          >
            <Switch
              unCheckedChildren={intl.formatMessage({
                id: 'unacceptAds',
                defaultMessage: 'Unaccept Ads'
              })}
              checkedChildren={intl.formatMessage({
                id: 'acceptAds',
                defaultMessage: 'Accept Ads'
              })}
              disabled={!settings.enableAdvertisement}
            />
          </Form.Item>
          <p className="white-color">
            {intl.formatMessage({ id: 'adEnabledInfo', defaultMessage: 'You enabled ad in your profile in:' })}
            <span style={{ margin: '0 4px' }}>
              {daysUntil(user.lastedEnableAd)}
            </span>
            {intl.formatMessage({ id: 'days', defaultMessage: 'days' })}
          </p>
          <p className="white-color">
            {intl.formatMessage(
              {
                id: 'adExplanation',
                defaultMessage:
                  'This is the count of days when you enable ads on your profile. You need to enable advertising on your profile for {days} days to receive higher commissions'
              },
              { days: settings.advertisementEnalbleIn }
            )}
          </p>
          <Divider>*</Divider>
          <Button
            block
            className="primary"
            htmlType="submit"
            disabled={updating}
            loading={updating}
          >
            {intl.formatMessage({ id: 'saveChanges', defaultMessage: 'Save Changes' })}
          </Button>
        </Col>
      </Row>
    </Form>
  );
}
