import { AiOutlineGlobal } from 'react-icons/ai';
import PageHeading from '@components/common/page-heading';
import PerformerBlockCountriesList from '@components/performer/list/performer-block-countries-list';
import { Metadata } from 'next';

export default function BlockCountriesPage() {
  return (
    <div className="main-container">
      <PageHeading icon={<AiOutlineGlobal />} title="Block Countries" />
      <PerformerBlockCountriesList />
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Block Countries'
};
