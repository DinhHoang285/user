/* eslint-disable no-case-declarations */

'use client';

import React from 'react';
import { Select } from 'antd';
import moment from 'moment';
import { useIntl } from 'react-intl';

interface IProps {
  onChange: any,
}

function SelectTime({ onChange }: IProps) {
  const intl = useIntl();

  const getStartOfLastMonth = () => {
    const startOfLastMonth = moment().subtract(1, 'months').startOf('month');
    return startOfLastMonth.format('YYYY-MM-DD');
  };

  const getStartOfCurrentMonth = () => {
    const startOfCurrentMonth = moment().startOf('month');
    return startOfCurrentMonth.format('YYYY-MM-DD');
  };

  const handleChange = (val) => {
    switch (val) {
      case 'lastMonth':
        const last = getStartOfLastMonth();
        onChange(last);
        return;
      case 'allTimes':
        onChange();
        return;
      default:
        const now = getStartOfCurrentMonth();
        onChange(now);
    }
  };

  return (
    <Select
      defaultValue="allTimes"
      style={{ width: 120, margin: '8px 0' }}
      onChange={handleChange}
      options={[
        { value: 'thisMonth', label: intl.formatMessage({ id: 'thisMonth', defaultMessage: 'This Month' }) },
        { value: 'lastMonth', label: intl.formatMessage({ id: 'lastMonth', defaultMessage: 'Last Month' }) },
        { value: 'allTimes', label: intl.formatMessage({ id: 'allTimes', defaultMessage: 'All Times' }) }
      ]}
    />
  );
}

export default SelectTime;
