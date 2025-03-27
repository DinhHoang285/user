import AuthWrapper from '@components/auth/auth-wrapper';
import ContactForm from '@components/contact/contact-form';
import { IPage } from '@interfaces/ui-config';
import { Metadata } from 'next';

export default async function Contact(props: IPage) {
  const searchParams = await props.searchParams;
  return (
    <AuthWrapper
      title="contactUs"
      isMobile={searchParams.viewport === 'mobile'}
      description="Please fill out the form below and we will get back to you as soon as possible"
    >
      <ContactForm />
    </AuthWrapper>
  );
}

export const metadata: Metadata = {
  title: 'Contact'
};
