import AuthWrapper from '@components/auth/auth-wrapper';
import ForgotPasswordForm from '@components/auth/forms/forgot-password-form';
import { IPage } from '@interfaces/ui-config';
import { Metadata } from 'next';
import withHydrationOnDemand from 'react-hydration-on-demand';

const ForgotPasswordFormVisible = withHydrationOnDemand({ on: ['idle', 'visible'] })(
  ForgotPasswordForm
);

export default async function ForgotPassword(props: IPage) {
  const searchParams = await props.searchParams;
  return (
    <AuthWrapper
      title="resetPassword"
      isMobile={searchParams.viewport === 'mobile'}
      description=""
    >
      <ForgotPasswordFormVisible />
    </AuthWrapper>
  );
}

export const metadata: Metadata = {
  title: 'Forgot Password'
};
