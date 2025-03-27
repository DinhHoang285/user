'use client';

import { showError, showSuccess, validateMessages } from '@lib/message';
import { performerService } from '@services/performer.service';
import {
  Button, Col, Divider, Form, InputNumber, Row, Switch
} from 'antd';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { IPerformer } from 'src/interfaces';
import { useMainThemeLayout } from 'src/providers/main-layout.provider';
import style from './subscriptionForm.module.scss';

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

interface IProps {
  user: IPerformer;
}

export function PerformerSubscriptionForm({
  user
}: IProps) {
  const intl = useIntl();
  const { settings } = useMainThemeLayout();
  const [updating, setUpdating] = useState(false);
  const { data: session, update: updateUser } = useSession();

  const [isFreeSubscription, setIsFreeSubscription] = useState(user.isFreeSubscription);
  const [freeSubscriptionDuration, setDuration] = useState(user.durationFreeSubscriptionDays);
  const [enabledMonthlyDiscount, setEnableMonthly] = useState(user.enabledMonthlyDiscount);
  const [enabledQuarterlyDiscount, setEnableQuarterly] = useState(user.enabledQuarterlyDiscount);
  const [enabledHalfYearlyDiscount, setEnableHalf] = useState(user.enabledHalfYearlyDiscount);
  const [enabledYearlyDiscount, setEnableYearly] = useState(user.enabledYearlyDiscount);

  useEffect(() => {
    setIsFreeSubscription(user.isFreeSubscription);
    setEnableMonthly(user.enabledMonthlyDiscount);
    setEnableQuarterly(user.enabledQuarterlyDiscount);
    setEnableHalf(user.enabledHalfYearlyDiscount);
    setEnableYearly(user.enabledYearlyDiscount);
  }, [user]);

  const updatePerformer = async (payload) => {
    const { _id } = payload;
    try {
      setUpdating(true);
      const updated = await performerService.updateMe(_id, payload);
      updateUser({ info: { ...session.user, ...updated.data } });
      showSuccess(intl.formatMessage({ id: 'changesSaved', defaultMessage: 'Changes saved' }));
    } catch (e) {
      showError(e);
    } finally {
      setUpdating(false);
    }
  };

  const submit = (data: any) => {
    updatePerformer({
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
          <Form.Item name="isFreeSubscription" valuePropName="checked">
            <Switch
              unCheckedChildren={intl.formatMessage({ id: 'freeSubscriptionOff', defaultMessage: 'Free Subscription OFF' })}
              checkedChildren={intl.formatMessage({ id: 'freeSubscriptionOn', defaultMessage: 'Free Subscription ON' })}
              onChange={(val) => setIsFreeSubscription(val)}
            />
          </Form.Item>
          {isFreeSubscription && (
            <Form.Item
              name="durationFreeSubscriptionDays"
              label={intl.formatMessage({
                id: 'durationDays',
                defaultMessage: 'Duration (days)'
              })}
              extra={(
                <p>
                  {intl.formatMessage(
                    {
                      id: 'userCanTrySubscription',
                      defaultMessage: `User can try ${freeSubscriptionDuration} days of free subscription before subscribing to a subscription.`
                    },
                    { day: freeSubscriptionDuration }
                  )}
                </p>
              )}
              rules={[{ required: true }]}
            >
              <InputNumber onChange={(v) => setDuration(v)} min={1} max={30} />
            </Form.Item>
          )}
          <Form.Item name="enabledMonthlyDiscount" valuePropName="checked">
            <Switch
              unCheckedChildren={intl.formatMessage({ id: 'monthlySubscriptionOff', defaultMessage: 'Monthly Subscription OFF' })}
              checkedChildren={intl.formatMessage({ id: 'monthlySubscriptionOn', defaultMessage: 'Monthly Subscription ON' })}
              onChange={(val) => setEnableMonthly(val)}
            />
          </Form.Item>
          {enabledMonthlyDiscount && (
            <>
              <Form.Item
                name="monthlyPrice"
                label={intl.formatMessage({ id: 'monthlySubscriptionPrice', defaultMessage: 'Monthly Subscription Price' })}
                rules={[
                  { required: true, message: intl.formatMessage({ id: 'addMonthlyPrice', defaultMessage: 'Please add price for monthly subscription' }) },
                  { min: settings.minimumMonthlySubscriptionPrice, type: 'number', message: intl.formatMessage({ id: 'minMonthlyPrice', defaultMessage: `Minimum subscription price is ${settings.minimumMonthlySubscriptionPrice}` }) },
                  { max: settings.maximumMonthlySubscriptionPrice, type: 'number', message: intl.formatMessage({ id: 'maxMonthlyPrice', defaultMessage: `Maximum subscription price is ${settings.maximumMonthlySubscriptionPrice}` }) }
                ]}
              >
                <InputNumber min={1} max={1000} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                name="monthlyDiscount"
                label={intl.formatMessage({ id: 'monthlyDiscount', defaultMessage: 'Monthly Discount' })}
                help={intl.formatMessage({ id: 'discountHelp', defaultMessage: 'Value is from 0.01 to 0.99 (1% - 99%)' })}
              >
                <InputNumber min={0} max={0.99} style={{ width: '100%' }} step={0.1} defaultValue={0} />
              </Form.Item>
            </>
          )}
          <Form.Item name="enabledQuarterlyDiscount" valuePropName="checked">
            <Switch
              unCheckedChildren={intl.formatMessage({ id: 'quarterlySubscriptionOff', defaultMessage: 'Quarterly Subscription OFF' })}
              checkedChildren={intl.formatMessage({ id: 'quarterlySubscriptionOn', defaultMessage: 'Quarterly Subscription ON' })}
              onChange={(val) => setEnableQuarterly(val)}
            />
          </Form.Item>
          {enabledQuarterlyDiscount && (
            <>
              <Form.Item
                name="quarterlyPrice"
                label={intl.formatMessage({ id: 'quarterlySubscriptionPrice', defaultMessage: 'Quarterly Subscription Price' })}
                rules={[
                  { required: true, message: intl.formatMessage({ id: 'addQuarterlyPrice', defaultMessage: 'Please add price for quarterly subscription' }) },
                  { min: settings.minimumQuarterflySubscriptionPrice, type: 'number', message: intl.formatMessage({ id: 'minQuarterlyPrice', defaultMessage: `Minimum subscription price is ${settings.minimumQuarterflySubscriptionPrice}` }) },
                  { max: settings.maximumQuarterflySubscriptionPrice, type: 'number', message: intl.formatMessage({ id: 'maxQuarterlyPrice', defaultMessage: `Maximum subscription price is ${settings.maximumQuarterflySubscriptionPrice}` }) }
                ]}
              >
                <InputNumber min={1} max={1000} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                name="quarterlyDiscount"
                label={intl.formatMessage({ id: 'quarterlyDiscount', defaultMessage: 'Quarterly Discount' })}
                help={intl.formatMessage({ id: 'discountHelp', defaultMessage: 'Value is from 0.01 to 0.99 (1% - 99%)' })}
              >
                <InputNumber min={0} max={0.99} style={{ width: '100%' }} step={0.1} defaultValue={0} />
              </Form.Item>
            </>
          )}
          <Form.Item name="enabledHalfYearlyDiscount" valuePropName="checked">
            <Switch
              unCheckedChildren={intl.formatMessage({ id: 'halfYearlySubscriptionOff', defaultMessage: 'Half-yearly Subscription OFF' })}
              checkedChildren={intl.formatMessage({ id: 'halfYearlySubscriptionOn', defaultMessage: 'Half-yearly Subscription ON' })}
              onChange={(val) => setEnableHalf(val)}
            />
          </Form.Item>
          {enabledHalfYearlyDiscount && (
            <>
              <Form.Item
                name="halfYearlyPrice"
                label={intl.formatMessage({ id: 'halfYearlySubscriptionPrice', defaultMessage: 'Half-yearly Subscription Price' })}
                rules={[
                  { required: true, message: intl.formatMessage({ id: 'addHalfYearlyPrice', defaultMessage: 'Please add price for half-yearly subscription' }) },
                  { min: settings.minimumHalfYearlySubscriptionPrice, type: 'number', message: intl.formatMessage({ id: 'minHalfYearlyPrice', defaultMessage: `Minimum subscription price is ${settings.minimumHalfYearlySubscriptionPrice}` }) },
                  { max: settings.maximumHalfYearlySubscriptionPrice, type: 'number', message: intl.formatMessage({ id: 'maxHalfYearlyPrice', defaultMessage: `Maximum subscription price is ${settings.maximumHalfYearlySubscriptionPrice}` }) }
                ]}
              >
                <InputNumber min={1} max={1000} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                name="halfYearlyDiscount"
                label={intl.formatMessage({ id: 'halfYearlyDiscount', defaultMessage: 'Half-yearly Discount' })}
                help={intl.formatMessage({ id: 'discountHelp', defaultMessage: 'Value is from 0.01 to 0.99 (1% - 99%)' })}
              >
                <InputNumber min={0} max={0.99} style={{ width: '100%' }} step={0.1} defaultValue={0} />
              </Form.Item>
            </>
          )}
          <Form.Item name="enabledYearlyDiscount" valuePropName="checked">
            <Switch
              unCheckedChildren={intl.formatMessage({ id: 'yearlySubscriptionOff', defaultMessage: 'Yearly Subscription OFF' })}
              checkedChildren={intl.formatMessage({ id: 'yearlySubscriptionOn', defaultMessage: 'Yearly Subscription ON' })}
              onChange={(val) => setEnableYearly(val)}
            />
          </Form.Item>
          {enabledYearlyDiscount && (
            <>
              <Form.Item
                name="yearlyPrice"
                label={intl.formatMessage({ id: 'yearlySubscriptionPrice', defaultMessage: 'Annually Subscription Price' })}
                rules={[
                  { required: true, message: intl.formatMessage({ id: 'addYearlyPrice', defaultMessage: 'Please add price for annually subscription' }) },
                  { min: settings.minimumYearlySubscriptionPrice, type: 'number', message: intl.formatMessage({ id: 'minYearlyPrice', defaultMessage: `Minimum subscription price is ${settings.minimumYearlySubscriptionPrice}` }) },
                  { max: settings.maximumYearlySubscriptionPrice, type: 'number', message: intl.formatMessage({ id: 'maxYearlyPrice', defaultMessage: `Maximum subscription price is ${settings.maximumYearlySubscriptionPrice}` }) }
                ]}
              >
                <InputNumber min={1} max={1000} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                name="yearlyDiscount"
                label={intl.formatMessage({ id: 'yearlyDiscount', defaultMessage: 'Annually Discount' })}
                help={intl.formatMessage({ id: 'discountHelp', defaultMessage: 'Value is from 0.01 to 0.99 (1% - 99%)' })}
              >
                <InputNumber min={0} max={0.99} style={{ width: '100%' }} step={0.1} defaultValue={0} />
              </Form.Item>
            </>
          )}
          <Divider>
            {intl.formatMessage({ id: 'streaming', defaultMessage: 'Streaming' })}
          </Divider>
          <Form.Item
            className="text-left"
            key="publicChatPrice"
            name="publicChatPrice"
            label={intl.formatMessage({
              id: 'defaultStreamingPrice',
              defaultMessage: 'Default Streaming Price'
            })}
            rules={[{
              required: true,
              message: intl.formatMessage({
                id: 'pleaseAddDefaultPriceStreaming',
                defaultMessage: 'Please add default streaming price'
              })
            }]}
          >
            <InputNumber style={{ width: '100%' }} min={1} max={10000} />
          </Form.Item>
          <Divider>
            {intl.formatMessage({ id: 'message', defaultMessage: 'Message' })}
          </Divider>
          <Form.Item name="enalbePayPerMessage" valuePropName="checked">
            <Switch
              unCheckedChildren={intl.formatMessage({ id: 'payPerMessageOff', defaultMessage: 'Disable pay per message' })}
              checkedChildren={intl.formatMessage({ id: 'payPerMessageOn', defaultMessage: 'Enable pay per message' })}
            />
          </Form.Item>
          <Form.Item
            key="pricePerMessage"
            name="pricePerMessage"
            label={intl.formatMessage({ id: 'pricePerMessage', defaultMessage: 'Price per message' })}
            rules={[{ required: true }]}
          >
            <InputNumber min={0.1} step={0.1} style={{ width: '100%' }} />
          </Form.Item>
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

export default PerformerSubscriptionForm;
