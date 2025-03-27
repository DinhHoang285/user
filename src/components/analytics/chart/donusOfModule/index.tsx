/* eslint-disable react/require-default-props */

'use client';

import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import { analyticsService } from '@services/analytics.service';
import ReactApexChart from 'react-apexcharts';
import SelectTime from '@components/analytics/actions/selectTime';

interface IProps {
  title: string,
}
function DonusChartOfModule({ title }: IProps) {
  const [appState, setAppState] = useState({
    series: [],
    options: {
      chart: {
        type: 'donut'
      },
      labels: []
    },
    month: null
  });

  const onChangeAppState = (obj) => {
    setAppState((prev) => ({ ...prev, ...obj }));
  };

  const getData = async () => {
    const resp = await analyticsService.getAnalyticsPercentage({
      month: appState.month
    });
    processData(resp.data);
  };

  const processData = (data) => {
    const lable = data.map((d) => (d.module as string).toUpperCase());
    const series = data.map((d) => parseFloat(d.totalAmount.toFixed(2)));
    onChangeAppState({
      series,
      options: {
        chart: {
          type: 'donut'
        },
        labels: lable.map((k) => k.toUpperCase())
      }
    });
  };

  const onChangeTime = async (time) => {
    onChangeAppState({ month: time });
  };

  useEffect(() => {
    getData();
  }, [appState.month]);

  return (
    <Card size="small" title={title} extra={<SelectTime onChange={onChangeTime} />}>
      <ReactApexChart
        options={appState.options as any}
        series={appState.series}
        type="donut"
        width="100%"
        height={300}
      />
    </Card>
  );
}

DonusChartOfModule.propTypes = {};

export default DonusChartOfModule;
