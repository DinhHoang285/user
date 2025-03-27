import AuthWrapper from '@components/auth/auth-wrapper';
import RegisterBenefits from '@components/auth/register/register-benefits';
import { IPage } from '@interfaces/ui-config';
import { settingService } from '@services/setting.service';
import { Metadata } from 'next';
import withHydrationOnDemand from 'react-hydration-on-demand';

const RegisterBenefitsVisible = withHydrationOnDemand({ on: ['idle', 'visible'] })(
  RegisterBenefits
);

export default async function Login(props: IPage) {
  const settings = await settingService.valueByKeys(['modelBenefit', 'userBenefit']);
  const searchParams = await props.searchParams;

  return (
    <AuthWrapper isMobile={searchParams.viewport === 'mobile'}>
      <RegisterBenefitsVisible
        modelBenefit={settings.modelBenefit}
        userBenefit={settings.userBenefit}
      />
    </AuthWrapper>
  );
}

export const metadata: Metadata = {
  title: 'Sign up'
};
