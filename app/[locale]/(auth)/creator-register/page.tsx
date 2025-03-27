import ModelRegisterForm from '@components/auth/forms/creator-signup-form';
import { performerCategoryService } from '@services/performer-category.service';
import { Metadata } from 'next';
import withHydrationOnDemand from 'react-hydration-on-demand';

const ModelRegisterFormVisible = withHydrationOnDemand({ on: ['idle', 'visible'] })(
  ModelRegisterForm
);

export default async function ModelRegister() {
  const resp = await performerCategoryService.search({ limit: 200 });
  return (
    <ModelRegisterFormVisible categories={resp?.data?.data || []} />
  );
}

export const metadata: Metadata = {
  title: 'Creator Signup'
};
