/* eslint-disable no-shadow */
/* eslint-disable array-callback-return */

'use client';

import SelectTime from '@components/analytics/actions/selectTime';
import { getDaysInMonth } from '@lib/date';
import { analyticsService } from '@services/analytics.service';
import { Card } from 'antd';
import React, { useEffect } from 'react';
import Chart from 'react-apexcharts';
import { useIntl } from 'react-intl';

interface IProps {
  title: string,
  module?: string
}

function CollumnChartByModule({ title, module }: IProps) {
  const intl = useIntl();
  const [appState, setAppState] = React.useState({
    month: null,
    series: [
      {
        name: intl.formatMessage({ id: 'revenue', defaultMessage: 'Revenue' }),
        type: 'column',
        data: []
      },
      {
        name: intl.formatMessage({ id: 'sales', defaultMessage: 'Sales' }),
        type: 'line',
        data: []
      }
    ],
    options: {
      chart: {
        height: 180,
        type: 'line'
      },
      yaxis: [
        {
          title: {
            text: intl.formatMessage({ id: 'revenue', defaultMessage: 'Revenue' })
          }
        }, {
          opposite: true,
          title: {
            text: intl.formatMessage({ id: 'sales', defaultMessage: 'Sales' })
          }
        }
      ],
      stroke: {
        width: [0, 4]
      },
      labels: []
    }
  });

  const onChangeAppState = (obj) => {
    setAppState((prev) => ({ ...prev, ...obj }));
  };

  const getData = async () => {
    const resp = await analyticsService.getAnalyticsGrowth({
      module,
      month: appState.month
    });
    processData(resp.data);
  };

  const processData = (data) => {
    const day = new Date(appState.month);
    const month = day.getMonth();
    const year = day.getFullYear();
    const days = getDaysInMonth(year, month);
    const quatities = [];
    const amounts = [];
    days.map((d: string) => {
      const date = d.slice(0, 2);
      const item = data.find((d: any) => String(d?._id?.day).padStart(2, '0').includes(date));
      quatities.push(parseFloat(item?.totalQuantity?.toFixed(0)) || 0);
      amounts.push(parseFloat(item?.totalAmount?.toFixed(0)) || 0);
    });
    onChangeAppState({
      series: [
        {
          name: intl.formatMessage({ id: 'revenue', defaultMessage: 'Revenue' }),
          type: 'column',
          data: amounts
        },
        {
          name: intl.formatMessage({ id: 'sales', defaultMessage: 'Sales' }),
          type: 'line',
          data: quatities
        }
      ],
      options: {
        chart: {
          height: 180,
          type: 'line'
        },
        yaxis: [
          {
            title: {
              text: intl.formatMessage({ id: 'revenue', defaultMessage: 'Revenue' })
            }
          }, {
            opposite: true,
            title: {
              text: intl.formatMessage({ id: 'sales', defaultMessage: 'Sales' })
            }
          }
        ],
        stroke: {
          width: [0, 4]
        },
        labels: days
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
      <Chart options={appState.options as any} series={appState.series} width="100%" />
    </Card>
  );
}

CollumnChartByModule.propTypes = {};

export default CollumnChartByModule;
