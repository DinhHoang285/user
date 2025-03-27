'use client';

import SelectPerformerDropdown from '@components/performer/common/select-performer-dropdown';
import {
  Col, DatePicker, Input, Row, Select,
  TimeRangePickerProps
} from 'antd';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { useIntl } from 'react-intl';
import style from './search-filter.module.scss';

const { RangePicker } = DatePicker;

interface IFilterState {
  q: string;
  status: string;
  mediaType: string;
  subscriptionType: string;
  performerId: string;
  isFree: string;
  fromDate: string;
  toDate: string;
}

interface IProps {
  onSubmit: (data: IFilterState) => void;
  statuses?: { key: string; text?: string }[];
  type?: { key: string; text?: string }[];
  subscriptionTypes?: { key: string; text?: string }[];
  searchWithPerformer?: boolean;
  searchWithKeyword?: boolean;
  dateRange?: boolean;
  isFree?: boolean;
  asideButton?: any;
  changeOrderAside?: boolean;
  setPagination?: (data: any) => void;
  typeDefault?: string;
}

export function SearchFilter({
  statuses,
  type,
  searchWithPerformer,
  searchWithKeyword,
  dateRange,
  isFree,
  onSubmit,
  subscriptionTypes,
  asideButton,
  changeOrderAside,
  setPagination,
  typeDefault = ''
}: IProps) {
  const intl = useIntl();

  const [filterState, setFilterState] = useState<IFilterState>({
    q: '',
    status: '',
    mediaType: typeDefault || '',
    subscriptionType: '',
    performerId: '',
    isFree: '',
    fromDate: '',
    toDate: ''
  });

  useEffect(() => {
    setFilterState((prev) => ({ ...prev, mediaType: typeDefault || '' }));
  }, [typeDefault]);

  const rangePresets: TimeRangePickerProps['presets'] = [
    { label: 'All times', value: [null, null] },
    { label: 'Today', value: [dayjs().startOf('day'), dayjs().endOf('day')] },
    { label: 'Yesterday', value: [dayjs().subtract(1, 'day').startOf('day'), dayjs().subtract(1, 'day').endOf('day')] },
    { label: 'This Week (Sun - Today)', value: [dayjs().startOf('week'), dayjs()] },
    { label: 'Last Week (Sun - Sat)', value: [dayjs().subtract(1, 'week').startOf('week'), dayjs().subtract(1, 'week').endOf('week')] },
    { label: 'Last 7 Days', value: [dayjs().subtract(7, 'day'), dayjs()] },
    { label: 'Last 28 Days', value: [dayjs().subtract(28, 'day'), dayjs()] },
    { label: 'Last 30 Days', value: [dayjs().subtract(30, 'day'), dayjs()] },
    { label: 'Last 90 Days', value: [dayjs().subtract(90, 'day'), dayjs()] },
    { label: 'This Month', value: [dayjs().startOf('month'), dayjs()] },
    { label: 'Last Month', value: [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')] },
    { label: 'Last 3 Months', value: [dayjs().subtract(3, 'month').startOf('month'), dayjs().endOf('day')] },
    { label: 'Last 6 Months', value: [dayjs().subtract(6, 'month').startOf('month'), dayjs().endOf('day')] },
    { label: 'Last 12 Months', value: [dayjs().subtract(12, 'month').startOf('month'), dayjs().endOf('day')] }
  ];

  const updateState = (key: keyof IFilterState, value: any) => {
    setFilterState((prev) => {
      const newState = { ...prev, [key]: value };
      onSubmit(newState);
      return newState;
    });
  };

  return (
    <Row className={style['search-filter']}>
      {searchWithKeyword && (
        <Col lg={8} md={8} xs={12} className={changeOrderAside && style['order-default']}>
          <Input
            placeholder={intl.formatMessage({ id: 'enterKeyword', defaultMessage: 'Enter keyword' })}
            onChange={(evt) => updateState('q', evt.target.value)}
            onPressEnter={() => onSubmit(filterState)}
          />
        </Col>
      )}

      {statuses && statuses.length > 0 && (
        <Col lg={8} md={8} xs={12} className={changeOrderAside && style['order-default']}>
          <Select
            style={{ width: '100%' }}
            placeholder={intl.formatMessage({ id: 'selectStatus', defaultMessage: 'Select status' })}
            defaultValue=""
            onChange={(val) => {
              updateState('status', val);
              setPagination?.({ current: 1, pageSize: 5 });
            }}
          >
            {statuses.map((s) => (
              <Select.Option key={s.key} value={s.key}>
                {s.text || s.key}
              </Select.Option>
            ))}
          </Select>
        </Col>
      )}

      {type && type.length > 0 && (
        <Col lg={6} md={6} xs={12} className={changeOrderAside && style['order-default']}>
          <Select
            style={{ width: '100%' }}
            placeholder={intl.formatMessage({ id: 'selectType', defaultMessage: 'Select type' })}
            defaultValue=""
            onChange={(val) => updateState('mediaType', val)}
            value={filterState.mediaType || ''}
          >
            {type.map((s) => (
              <Select.Option key={s.key} value={s.key}>
                {s.text || s.key}
              </Select.Option>
            ))}
          </Select>
        </Col>
      )}

      {subscriptionTypes && subscriptionTypes.length > 0 && (
        <Col lg={8} md={8} xs={12} className={changeOrderAside && style['order-default']}>
          <Select
            style={{ width: '100%' }}
            placeholder={intl.formatMessage({ id: 'selectType', defaultMessage: 'Select type' })}
            defaultValue=""
            onChange={(val) => updateState('subscriptionType', val)}
          >
            {subscriptionTypes.map((s) => (
              <Select.Option key={s.key} value={s.key}>
                {s.text || s.key}
              </Select.Option>
            ))}
          </Select>
        </Col>
      )}

      {searchWithPerformer && (
        <Col lg={8} md={8} xs={12} className={changeOrderAside && style['order-default']}>
          <SelectPerformerDropdown
            showAll
            defaultValue=""
            placeholder={intl.formatMessage({ id: 'searchCreatorHere', defaultMessage: 'Search creator here' })}
            style={{ width: '100%' }}
            onSelect={(val) => updateState('performerId', val)}
          />
        </Col>
      )}

      {dateRange && (
        <Col lg={8} md={8} xs={12} className={changeOrderAside && style['order-default']}>
          <RangePicker
            presets={rangePresets}
            style={{ width: '100%' }}
            onChange={(dates: [any, any], dateStrings: [string, string]) => {
              updateState('fromDate', dateStrings[0]);
              updateState('toDate', dateStrings[1]);
            }}
          />
        </Col>
      )}

      {isFree && (
        <Col lg={8} md={8} xs={12} className={changeOrderAside && style['order-default']}>
          <Select
            style={{ width: '100%' }}
            placeholder={intl.formatMessage({ id: 'selectType', defaultMessage: 'Select type' })}
            defaultValue=""
            onChange={(val) => updateState('isFree', val)}
          >
            <Select.Option key="" value="">
              {intl.formatMessage({ id: 'allType', defaultMessage: 'All Type' })}
            </Select.Option>
            <Select.Option key="free" value="true">
              {intl.formatMessage({ id: 'free', defaultMessage: 'Free' })}
            </Select.Option>
            <Select.Option key="paid" value="false">
              {intl.formatMessage({ id: 'paid', defaultMessage: 'Paid' })}
            </Select.Option>
          </Select>
        </Col>
      )}

      {asideButton && (
        <Col
          flex="auto"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end'
          }}
          className={changeOrderAside && style['order-first']}
        >
          <span />
          {asideButton}
        </Col>
      )}
    </Row>
  );
}

SearchFilter.defaultProps = {
  statuses: [],
  type: [
    { key: '', text: 'All Post' },
    { key: 'text', text: 'Text' },
    { key: 'audio', text: 'Audio' },
    { key: 'video', text: 'Video' },
    { key: 'photo', text: 'Photo' },
    { key: 'product', text: 'Product' }
  ],
  subscriptionTypes: [],
  searchWithPerformer: false,
  searchWithKeyword: false,
  dateRange: false,
  isFree: false,
  asideButton: null,
  changeOrderAside: false,
  setPagination: () => { },
  typeDefault: ''
};
