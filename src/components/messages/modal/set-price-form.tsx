/* eslint-disable no-param-reassign */
import { showError } from '@lib/message';
import {
  Button, Col, DatePicker, Form, InputNumber, Row, Select
} from 'antd';
import dayjs from 'dayjs';
import moment from 'moment';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useMainThemeLayout } from 'src/providers/main-layout.provider';
import style from './set-price-form.module.scss';

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

interface IProps {
  onClose: Function;
  onFinish: Function;
  price: number;
  isSale: boolean;
  timeToExpried: Date;
}

export function MessagePriceForm({
  onClose, onFinish, price, isSale, timeToExpried
}: IProps) {
  const intl = useIntl();
  const { settings } = useMainThemeLayout();
  const [_isSale, setSale] = useState(isSale.toString());
  const [isLimitTime, setIsLimitTime] = useState(!!timeToExpried);
  const [open, setOpen] = useState(false);
  const [formRef] = Form.useForm();

  const onChangeSale = (val) => {
    setSale(val);
    val === 'false' && formRef.setFieldsValue({ price: null });
    val === 'true' && formRef.setFieldsValue({ price: 20 });
  };

  const disabledDate = (current) => current && current < moment().startOf('day');

  const handleChange = (value) => {
    try {
      const tenMinutesFromNow = moment().add(10, 'minutes');
      const now = moment();
      if (value && (value < tenMinutesFromNow || value < now)) throw new Error('Invalid time');
      setOpen(false);
    } catch {
      showError(
        intl.formatMessage({
          id: 'selectValidTime',
          defaultMessage: 'Please select a time at least 10 minutes from now.'
        })
      );
      setOpen(true);
    }
  };

  return (
    <Form
      form={formRef}
      {...layout}
      name="price-message-form"
      className={style['price-message-form']}
      onFinish={(data) => {
        if (data.isSale === 'false') {
          data.price = 0;
        }

        onFinish({
          price: data.price,
          isSale: data.isSale === 'true',
          timeToExpried: (data.isSale === 'true' && data.isLimitTime === 'true') ? data.timeToExpried : null
        });
      }}
      initialValues={{
        price,
        isSale: isSale.toString(),
        timeToExpried: timeToExpried || dayjs().add(10, 'minutes'),
        isLimitTime: isLimitTime.toString()
      }}
    >
      <Row>
        <Col span={24} className={style['form-lb']}>
          {intl.formatMessage({ id: 'messageType', defaultMessage: 'Message Type' })}
        </Col>
        <Col span={12} style={{ padding: '5px 0' }}>
          <Form.Item name="isSale">
            <Select onChange={(val) => onChangeSale(val)} size="small">
              <Select.Option key="true" value="true">
                {intl.formatMessage({ id: 'payChargeForContent', defaultMessage: 'Pay - Charge for content' })}
              </Select.Option>
              <Select.Option key="false" value="false">
                {intl.formatMessage({ id: 'publicEveryoneCanAccess', defaultMessage: 'Public - Everyone can access' })}
              </Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12} style={{ padding: '5px 0' }}>
          <Form.Item
            name="price"
            style={{ width: '100%' }}
            rules={[
              {
                type: 'number',
                max: _isSale === 'true' ? settings.maximumPpvPrice : null,
                min: _isSale === 'true' ? settings.minimumPpvPrice || 1 : 0,
                message: intl.formatMessage(
                  {
                    id: 'priceMustBetween',
                    defaultMessage: `The price must be between €${settings.minimumPpvPrice} - €${settings.maximumPpvPrice}`
                  },
                  {
                    min: settings.minimumPpvPrice,
                    max: settings.maximumPpvPrice
                  }
                ),
                transform(value) {
                  return Number(value);
                }
              }
            ]}
          >
            <InputNumber
              placeholder={intl.formatMessage({ id: 'enterPrice', defaultMessage: 'Enter Price' })}
              style={{ width: '100%' }}
              disabled={_isSale === 'false'}
            />
          </Form.Item>
        </Col>
        <Col span={12} style={{ padding: '5px 0' }}>
          <Form.Item name="isLimitTime">
            <Select
              onChange={(val) => setIsLimitTime(val === 'true')}
              size="small"
              disabled={_isSale === 'false'}
            >
              <Select.Option key="true" value="true">
                {intl.formatMessage({ id: 'limitedAvailableForAShortTime', defaultMessage: 'Limited - available for a short time' })}
              </Select.Option>
              <Select.Option key="false" value="false">
                {intl.formatMessage({ id: 'unlimitedAvailableAnytime', defaultMessage: 'Unlimited - available anytime' })}
              </Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12} style={{ padding: '5px 0' }}>
          <Form.Item style={{ width: '100%' }} name="timeToExpried">
            <DatePicker
              showTime={{ format: 'HH:mm' }}
              format="YYYY-MM-DD HH:mm"
              placeholder={intl.formatMessage({ id: 'timeToExpire', defaultMessage: 'Time to expire' })}
              style={{ width: '100%' }}
              disabled={!isLimitTime}
              disabledDate={disabledDate}
              open={open}
              onChange={handleChange}
              showNow={false}
              onClick={() => setOpen(true)}
            />
          </Form.Item>
        </Col>
      </Row>
      <div className={style['btn-grps']}>
        <Button className="secondary" onClick={() => onClose()}>
          {intl.formatMessage({ id: 'cancel', defaultMessage: 'Cancel' })}
        </Button>
        <Button className="primary" htmlType="submit">
          {intl.formatMessage({ id: 'save', defaultMessage: 'Save' })}
        </Button>
      </div>
    </Form>
  );
}

export default MessagePriceForm;
