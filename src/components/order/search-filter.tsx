import {
  Col, DatePicker, Row, Select
} from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import style from './search-filter.module.scss';

const { RangePicker } = DatePicker;

interface IProps {
  onSubmit: Function;
}

export function OrderSearchFilter({ onSubmit }: IProps) {
  const intl = useIntl();
  const [state, setState] = useState({
    deliveryStatus: '',
    status: '',
    fromDate: '',
    toDate: ''
  });

  const handleSubmit = (key: string, value: any) => {
    const newState = { ...state, [key]: value };
    setState(newState);
    onSubmit(newState);
  };

  const deliveryStatuses = [
    {
      key: 'processing',
      text: intl.formatMessage({ id: 'processing', defaultMessage: 'Processing' })
    },
    {
      key: 'shipping',
      text: intl.formatMessage({ id: 'shipped', defaultMessage: 'Shipped' })
    },
    {
      key: 'delivered',
      text: intl.formatMessage({ id: 'delivered', defaultMessage: 'Delivered' })
    },
    {
      key: 'refunded',
      text: intl.formatMessage({ id: 'refunded', defaultMessage: 'Refunded' })
    }
  ];

  return (
    <Row className={style['search-filter']}>
      <Col lg={6} md={8} xs={12}>
        <Select
          onChange={(val) => handleSubmit('deliveryStatus', val)}
          style={{ width: '100%' }}
          placeholder={intl.formatMessage({ id: 'selectDeliveryStatus', defaultMessage: 'Select delivery status' })}
          defaultValue=""
        >
          <Select.Option key="all" value="">
            {intl.formatMessage({ id: 'allDeliveryStatuses', defaultMessage: 'All delivery statuses' })}
          </Select.Option>
          {deliveryStatuses.map((s) => (
            <Select.Option key={s.key} value={s.key}>
              {intl.formatMessage({ id: s.key, defaultMessage: s.text })}
            </Select.Option>
          ))}
        </Select>
      </Col>
      <Col lg={10} md={10} xs={12}>
        <RangePicker
          disabledDate={(current) => current > dayjs().endOf('day') || current < dayjs().subtract(10, 'years').endOf('day')}
          style={{ width: '100%' }}
          onChange={(dates: [any, any], dateStrings: [string, string]) => {
            const newState = { ...state, fromDate: dateStrings[0], toDate: dateStrings[1] };
            setState(newState);
            onSubmit(newState);
          }}
        />
      </Col>
    </Row>
  );
}
