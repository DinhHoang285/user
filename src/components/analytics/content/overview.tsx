'use client';

import { Col, Row } from 'antd';
import dynamic from 'next/dynamic';
import { useIntl } from 'react-intl';

const TopSalesByModule = dynamic(() => import('@components/analytics/table/topByModule'));
const TopTipByModule = dynamic(() => import('@components/analytics/table/topTipModule'), { ssr: false });
const TopSpendByModule = dynamic(() => import('@components/analytics/table/topSpendModule'), { ssr: false });
const TopSubbedByModule = dynamic(() => import('@components/analytics/table/topSubbedModule'), { ssr: false });
const CollumnChartByModule = dynamic(() => import('@components/analytics/chart/collumnByModule'), { ssr: false });
const DonusChartOfModule = dynamic(() => import('@components/analytics/chart/donusOfModule'), { ssr: false });
const DonusChartByModule = dynamic(() => import('@components/analytics/chart/donusByModule'), { ssr: false });

function OverviewContent() {
  const intl = useIntl();
  return (
    <Row>
      <Col xs={24} md={15}>
        <TopSalesByModule title={intl.formatMessage({ id: 'top10PPVHasMostRevenue', defaultMessage: 'TOP 10 PPV Has Most Revenue' })} />
      </Col>
      <Col xs={24} md={9}>
        <DonusChartOfModule title={intl.formatMessage({ id: 'percentageOfRevenueOfPPVTypes', defaultMessage: 'Percentage Of Revenue Of PPV Types' })} />
      </Col>
      <Col xs={24} md={24}>
        <CollumnChartByModule title={intl.formatMessage({ id: 'PPVSalesAndRevenueChart', defaultMessage: 'PPV sales and revenue chart' })} module="tip" />
      </Col>
      <Col xs={24} md={12}>
        <TopTipByModule title={intl.formatMessage({ id: 'top10TippingOnYourProfile', defaultMessage: 'Top 10 Tipping on Your Profile' })} module="tip" />
      </Col>
      <Col xs={24} md={12}>
        <TopSpendByModule title={intl.formatMessage({ id: 'top10SpendOnYourProfile', defaultMessage: 'Top 10 Spend on Your Profile' })} />
      </Col>
      <Col xs={24} md={12}>
        <DonusChartByModule title={intl.formatMessage({ id: 'thetipPercentageOfYourTotalSales', defaultMessage: 'The tip\'s percentage of your total sales' })} module="tip" />
      </Col>
      <Col xs={24} md={12}>
        <DonusChartByModule title={intl.formatMessage({ id: 'thefeedPercentageOfYourTotalSales', defaultMessage: 'The feed\'s percentage of your total sales' })} module="feed" />
      </Col>
      <Col xs={24} md={12}>
        <DonusChartByModule title={intl.formatMessage({ id: 'thevideoPercentageOfYourTotalSales', defaultMessage: 'The video\'s percentage of your total sales' })} module="video" />
      </Col>
      <Col xs={24} md={12}>
        <DonusChartByModule title={intl.formatMessage({ id: 'thegalleryPercentageOfYourTotalSales', defaultMessage: 'The gallery\'s percentage of your total sales' })} module="gallery" />
      </Col>
      <Col xs={24} md={12}>
        <DonusChartByModule title={intl.formatMessage({ id: 'themessagePercentageOfYourTotalSales', defaultMessage: 'The message\'s percentage of your total sales' })} module="message" />
      </Col>
      <Col xs={24} md={12}>
        <DonusChartByModule title={intl.formatMessage({ id: 'theproductPercentageOfYourTotalSales', defaultMessage: 'The product\'s percentage of your total sales' })} module="product" />
      </Col>
      <Col xs={24} md={12}>
        <TopSubbedByModule title={intl.formatMessage({ id: 'top10SubbedLongestOnYourProfile', defaultMessage: 'Top 10 Subbed Longest on Your Profile' })} />
      </Col>
      <Col xs={24} md={12}>
        <DonusChartByModule title={intl.formatMessage({ id: 'thesubcriptionPercentageOfYourTotalSales', defaultMessage: 'The subcription\'s percentage of your total sales' })} module="subcription" />
      </Col>
    </Row>
  );
}

OverviewContent.propTypes = {};

export default OverviewContent;
