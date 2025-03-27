import AuthWrapper from '@components/auth/auth-wrapper';
import SocialLoginGroup from '@components/auth/social-login-group';
import LoginForm from '@components/auth/forms/login-form';
import { Metadata } from 'next';
import withHydrationOnDemand from 'react-hydration-on-demand';
import { IPage } from '@interfaces/ui-config';

const SocialLoginGroupVisible = withHydrationOnDemand({ on: ['idle', 'visible'] })(
  SocialLoginGroup
);
const LoginFormVisible = withHydrationOnDemand({ on: ['idle', 'visible'] })(
  LoginForm
);

export default async function Login(props: IPage) {
  const searchParams = await props.searchParams;

  return (
    <AuthWrapper
      isMobile={searchParams.viewport === 'mobile'}
      description="Sign up to make money and interact with your fans!"
    >
      <SocialLoginGroupVisible />
      <LoginFormVisible />
    </AuthWrapper>
  );
}

export const metadata: Metadata = {
  title: 'Login'
};
