/* eslint-disable no-shadow */

import PageHeading from '@components/common/page-heading';
import dynamic from 'next/dynamic';
import { AiFillPieChart } from 'react-icons/ai';
import { Metadata } from 'next';

const OverviewContent = dynamic(() => import('@components/analytics/content/overview'));

export default function Analytics() {
  return (
    <div className="main-container">
      <PageHeading title="Fan Insight" icon={<AiFillPieChart />} />
      <OverviewContent />
    </div>
  );
}
export const metadata: Metadata = {
  title: 'Analytics'
};
