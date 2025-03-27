import { Metadata } from 'next';
import Link from 'next/link';

export default function EmailVerifiedSuccess() {
  return (
    <div className="main-container" style={{ textAlign: 'center', minHeight: '60dvh' }}>
      <h3 style={{ fontSize: 30 }}>Email verified</h3>
      <p>Your email has been successfully verified.</p>
      <p>
        <Link href="/" style={{ color: '#d36cd3' }}>
          {' '}
          Click here to login.
        </Link>
      </p>
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Email verified success'
};
