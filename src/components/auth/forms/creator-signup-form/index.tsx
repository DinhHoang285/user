/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import { IPerformerCategory } from '@interfaces/performer-category';
import { showError, showSuccess } from '@lib/message';
import {
  confirmPassword,
  dateOfBirth,
  emailValidate,
  firstNameValidate, lastNameValidate, nameValidate,
  passwordValidate,
  usernameValidate
} from '@lib/validation';
import { authService } from '@services/auth.service';
import {
  DatePicker,
  Form,
  Input,
  Select
} from 'antd';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRef, useState } from 'react';
import { AiOutlineLink } from 'react-icons/ai';
import { useIntl } from 'react-intl';
import { COUNTRIES } from 'src/constants/countries';
import { useMainThemeLayout } from 'src/providers/main-layout.provider';
import fronIdImage from '../../../../../public/front-id.png';
import holdingIdImage from '../../../../../public/holding-id.png';
import ImageUploadModel from './image-upload-model';
import style from './style.module.scss';

const { Option } = Select;

interface P {
  categories: IPerformerCategory[];
}

export default function ModelRegisterForm({ categories }: P) {
  const { settings } = useMainThemeLayout();
  const router = useRouter();
  const idFile = useRef(null);
  const documentFile = useRef(null);
  const [loading, setLoading] = useState(false);
  const intl = useIntl();
  const searchParams = useSearchParams();
  const rel = searchParams.get('rel');

  return (
    <div className="main-container">
      <div className={style['register-box']}>
        <h1 className={style.title}>
          <span>{intl.formatMessage({ id: 'creatorSignUp', defaultMessage: 'Creator Sign Up' })}</span>
        </h1>
        <p className={style['sub-title']}>
          <small>
            <span>{intl.formatMessage({ id: 'signUpToMakeMoney', defaultMessage: 'Sign up to make money and interact with your fans!' })}</span>
          </small>
        </p>
        <Form
          name="creator_register"
          initialValues={{
            gender: 'Female',
            country: 'US',
            dateOfBirth: '',
            rel
          }}
          onFinish={async (values: any) => {
            try {
              const data = { ...values, commission: settings.userReferralCommission };
              if (!idFile.current || !documentFile.current) {
                showError(intl.formatMessage({ id: 'documentsAreRequired', defaultMessage: 'ID documents are required!' }));
                return;
              }
              const verificationFiles = [{
                fieldname: 'idVerification',
                file: idFile.current
              }, {
                fieldname: 'documentVerification',
                file: documentFile.current
              }];
              setLoading(true);
              const resp = await authService.registerPerformer(verificationFiles, data, () => { });
              const { data: respData } = resp as any;
              showSuccess(
                intl.formatMessage(
                  {
                    id: 'thankYouForApplying',
                    defaultMessage: 'Thank you for applying to be a {siteName} creator! {message}'
                  },
                  {
                    siteName: settings?.siteName || '',
                    message: respData?.message || intl.formatMessage({ id: 'yourApplicationWillBeProcessed', defaultMessage: 'Your application will be processed within 24 to 48 hours, most times sooner. You will get an email notification sent to your email address with the status update.' })
                  }
                )
              );
              router.push('/');
            } catch (e) {
              showError(e);
            } finally {
              setLoading(false);
            }
          }}
          scrollToFirstError
        >
          <div className="main-form">
            <div className="form-group">
              <Form.Item
                name="firstName"
                validateTrigger={['onChange', 'onBlur']}
                rules={firstNameValidate}
              >
                <Input placeholder={intl.formatMessage({ id: 'firstName', defaultMessage: 'First name' })} />
              </Form.Item>
              <Form.Item
                name="lastName"
                validateTrigger={['onChange', 'onBlur']}
                rules={lastNameValidate}
              >
                <Input placeholder={intl.formatMessage({ id: 'lastName', defaultMessage: 'Last name' })} />
              </Form.Item>
              <Form.Item
                name="name"
                validateTrigger={['onChange', 'onBlur']}
                rules={nameValidate}
              >
                <Input placeholder={intl.formatMessage({ id: 'displayName', defaultMessage: 'Display name' })} />
              </Form.Item>
              <Form.Item
                name="username"
                validateTrigger={['onChange', 'onBlur']}
                rules={usernameValidate}
              >
                <Input placeholder={intl.formatMessage({ id: 'username', defaultMessage: 'Username' })} />
              </Form.Item>
              <Form.Item
                name="email"
                validateTrigger={['onChange', 'onBlur']}
                rules={emailValidate}
              >
                <Input placeholder={intl.formatMessage({ id: 'emailAddress', defaultMessage: 'Email address' })} />
              </Form.Item>
              <Form.Item
                name="dateOfBirth"
                validateTrigger={['onChange', 'onBlur']}
                rules={dateOfBirth}
              >
                <DatePicker
                  placeholder={intl.formatMessage({ id: 'dateOfBirth(DD/MM/YYYY)', defaultMessage: 'Date of Birth (DD/MM/YYYY)' })}
                  format="DD/MM/YYYY"
                  disabledDate={(currentDate) => currentDate > dayjs().subtract(18, 'year').endOf('day')}
                  title={intl.formatMessage({ id: 'dateOfBirth', defaultMessage: 'Date Of Birth' })}
                />
              </Form.Item>
              <Form.Item name="country" rules={[{ required: true }]}>
                <Select showSearch optionFilterProp="label">
                  {COUNTRIES.map((c) => (
                    <Option value={c.code} key={c.code} label={c.name}>
                      <p className={style['select-country']}>
                        <img alt="country_flag" src={c.flag} width="25px" />
                        <span>{c.name}</span>
                      </p>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="gender"
                validateTrigger={['onChange', 'onBlur']}
                rules={[{ required: true, message: intl.formatMessage({ id: 'pleaseSelectYourGender', defaultMessage: 'Please select your gender' }) }]}
              >
                <Select>
                  <Option value="male" key="male">
                    <span>{intl.formatMessage({ id: 'male', defaultMessage: 'Male' })}</span>
                  </Option>
                  <Option value="female" key="female">
                    <span>{intl.formatMessage({ id: 'female', defaultMessage: 'Female' })}</span>
                  </Option>
                  <Option value="transgender" key="trans">
                    <span>{intl.formatMessage({ id: 'trans', defaultMessage: 'Trans' })}</span>
                  </Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="password"
                validateTrigger={['onChange', 'onBlur']}
                rules={passwordValidate}
              >
                <Input.Password id="password" placeholder={intl.formatMessage({ id: 'password', defaultMessage: 'Password' })} />
              </Form.Item>
              <Form.Item
                name="confirm"
                dependencies={['password']}
                validateTrigger={['onChange', 'onBlur']}
                rules={confirmPassword}
              >
                <Input.Password placeholder={intl.formatMessage({ id: 'confirmPassword', defaultMessage: 'Confirm Password' })} />
              </Form.Item>
              <Form.Item
                className="referral"
                name="rel"
                validateTrigger={['onChange', 'onBlur']}
                rules={[]}
              >
                <Input
                  placeholder={intl.formatMessage({ id: 'referralCode', defaultMessage: 'Referral code' })}
                  prefix={<span><AiOutlineLink /></span>}
                />
              </Form.Item>
            </div>
            <div className="upload-grp">
              <div className={style['model-photo-verification']}>
                <div className={style['id-block']}>
                  <ImageUploadModel onFileReaded={(f) => { idFile.current = f; }} />
                  <Image
                    alt="id-img"
                    className={style['img-id']}
                    priority
                    loading="eager"
                    unoptimized
                    width={140}
                    height={140}
                    src={fronIdImage}
                  />
                </div>
                <p className={style['upload-grp-text']}>
                  <span>{intl.formatMessage({ id: 'yourGovernmentIssued', defaultMessage: 'Your government issued ID card, National ID card, Passport or Driving license' })}</span>
                </p>
              </div>
              <div className={style['model-photo-verification']}>
                <div className={style['id-block']}>
                  <ImageUploadModel onFileReaded={(f) => { documentFile.current = f; }} />
                  <Image
                    alt="holding-img"
                    className={style['img-id']}
                    priority
                    loading="eager"
                    unoptimized
                    width={140}
                    height={140}
                    src={holdingIdImage}
                  />
                </div>
                <p className={style['upload-grp-text']}>
                  <span>{intl.formatMessage({ id: 'yourSelfieWithYour', defaultMessage: 'Your selfie with your ID and handwritten note' })}</span>
                </p>
              </div>
            </div>
          </div>
          <div className="box-button">
            <button
              type="submit"
              disabled={loading}
              className={style['form-button']}
            >
              <span>{intl.formatMessage({ id: 'createYourAccount', defaultMessage: 'Create your account' })}</span>
            </button>
          </div>
        </Form>
        <div className={`${style['register-footer']} text-center`}>
          <p>
            <span>{intl.formatMessage({ id: 'signingUpYouAgree', defaultMessage: 'By signing up you agree to our' })}</span>
            {' '}
            <Link href="/page/term-of-service" target="_blank" style={{ color: '#d36cd3' }}>
              <span>{intl.formatMessage({ id: 'termsOfService', defaultMessage: 'Terms of Service' })}</span>
            </Link>
            {' '}
            <span>{intl.formatMessage({ id: 'and', defaultMessage: 'and' })}</span>
            {' '}
            <Link href="/page/privacy-policy" target="_blank" style={{ color: '#d36cd3' }}>
              <span>{intl.formatMessage({ id: 'privacyPolicy', defaultMessage: 'Privacy Policy' })}</span>
            </Link>
            {' '}
            <span>{intl.formatMessage({ id: 'confirm18YearsOld', defaultMessage: 'and confirm that you are at least 18 years old.' })}</span>
          </p>
          <p>
            <span>{intl.formatMessage({ id: 'haveAnAccountAlready', defaultMessage: 'Have an account already?' })}</span>
            &nbsp;
            <Link href="/login" style={{ color: '#d36cd3' }}>
              <span>{intl.formatMessage({ id: 'loginHere', defaultMessage: 'Log in here.' })}</span>
            </Link>
          </p>
          <p>
            <span>{intl.formatMessage({ id: 'areYouAFan', defaultMessage: 'Are you a fan?' })}</span>
            &nbsp;
            <Link href="/fan-register" style={{ color: '#d36cd3' }}>
              <span>{intl.formatMessage({ id: 'signUpHere', defaultMessage: 'Sign up here.' })}</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
