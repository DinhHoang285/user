import AuthWrapper from '@components/auth/auth-wrapper';
import FanRegisterForm from '@components/auth/forms/fan-signup-form';
import SocialLoginGroup from '@components/auth/social-login-group';
import { IPage } from '@interfaces/ui-config';
import { Metadata } from 'next';
import withHydrationOnDemand from 'react-hydration-on-demand';

const SocialLoginGroupVisible = withHydrationOnDemand({ on: ['idle', 'visible'] })(
  SocialLoginGroup
);
const FanRegisterFormVisible = withHydrationOnDemand({ on: ['idle', 'visible'] })(
  FanRegisterForm
);

export default async function FanRegister(props: IPage) {
  const searchParams = await props.searchParams;
  return (
    <AuthWrapper
      title="fanSignUp"
      isMobile={searchParams.viewport === 'mobile'}
      description="Sign up to interact with your idols!"
    >
      <SocialLoginGroupVisible />
      <FanRegisterFormVisible />
    </AuthWrapper>
  );
}

export const metadata: Metadata = {
  title: 'Fan Signup'
};
