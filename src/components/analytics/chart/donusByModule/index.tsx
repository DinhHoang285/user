/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/require-default-props */

'use client';

import SelectTime from '@components/analytics/actions/selectTime';
import { analyticsService } from '@services/analytics.service';
import { Card } from 'antd';
import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

interface IProps {
  title: string,
  module: string
}
function DonusChartByModule({ title, module }: IProps) {
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
    const resp = await analyticsService.getAnalyticsPercentageByModule({
      module,
      month: appState.month
    });
    if (resp.data) {
      const obj: any = resp.data[0];
      const data = [...obj?.byModule, ...obj?.other];
      processData(data);
    }
  };

  const processData = (data) => {
    const lable = data.map((d) => (d.module as string)?.toUpperCase());
    const series = data.map((d) => parseFloat(d?.totalAmount?.toFixed(2)));
    onChangeAppState({
      series,
      options: {
        chart: {
          type: 'donut'
        },
        labels: lable.map((k) => k?.toUpperCase())
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

DonusChartByModule.propTypes = {};

export default DonusChartByModule;
