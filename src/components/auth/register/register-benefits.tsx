'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useSearchParams } from 'next/navigation';
import style from './style.module.scss';

export default function RegisterBenefits({
  modelBenefit, userBenefit
}: {
  modelBenefit: string; userBenefit: string
}) {
  const [loginAs, setLoginAs] = useState('user');
  const searchParams = useSearchParams();
  const intl = useIntl();
  const rel = searchParams.get('rel');
  return (
    <>
      <div className={style['switch-btn']}>
        <button
          className={loginAs === 'user' ? 'active' : ''}
          type="button"
          onClick={() => setLoginAs('user')}
        >
          {intl.formatMessage({ id: 'fanSignUp', defaultMessage: 'Fan Sign Up' })}
        </button>
        <button
          className={loginAs === 'performer' ? 'active' : ''}
          type="button"
          onClick={() => setLoginAs('performer')}
        >
          {intl.formatMessage({ id: 'creatorSignUp', defaultMessage: 'Creator Sígn Up' })}
        </button>
      </div>
      <div className={style['welcome-content']}>
        <h3>
          {loginAs === 'user' ? 'Fan' : 'Creator'}
          {' '}
          {intl.formatMessage({ id: 'Benefits', defaultMessage: 'Benefits' })}
        </h3>
        {loginAs === 'performer' ? (
          <>
            {/* eslint-disable-next-line react/no-danger */}
            <div dangerouslySetInnerHTML={{ __html: modelBenefit }} />
            <Link href={rel ? `/creator-register?rel=${rel}` : '/creator-register'}>
              <button type="button" className="primary">
                {intl.formatMessage({ id: 'creatorSignUp', defaultMessage: 'Creator Sígn Up' })}
              </button>
            </Link>
          </>
        ) : (
          <>
            {/* eslint-disable-next-line react/no-danger */}
            <div dangerouslySetInnerHTML={{ __html: userBenefit }} />
            <Link href={rel ? `/fan-register?rel=${rel}` : '/fan-register'}>
              <button type="button" className="primary">
                {intl.formatMessage({ id: 'fanSignUp', defaultMessage: 'Fan Sign Up"' })}
              </button>
            </Link>
          </>
        )}
      </div>
      <p className={`text-center ${style.navigate}`}>
        <span style={{ fontSize: 18, margin: 0 }}>
          {intl.formatMessage({ id: 'haveAccountAlready', defaultMessage: 'Have an account already?' })}
        </span>
        <Link href="/">
          {intl.formatMessage({ id: 'logInHere.', defaultMessage: 'Log In Here.' })}
        </Link>
      </p>
    </>
  );
}
