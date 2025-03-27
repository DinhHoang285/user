import { performerCategoryService } from '@services/performer-category.service';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

const AccountSettingsTabs = dynamic(() => import('@components/performer/tabs/accountTabs'));
export default async function AccountSettings() {
  try {
    const categories = await performerCategoryService.search({ limit: 500 });

    if (!categories.data.data) {
      notFound();
    }
    return (
      <div className="main-container">
        <AccountSettingsTabs categories={categories.data.data} />
      </div>
    );
  } catch {
    notFound();
  }
}

export const metadata: Metadata = {
  title: 'Update Gallery'
};
