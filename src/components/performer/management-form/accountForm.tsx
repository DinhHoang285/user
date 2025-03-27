'use client';

import { AiOutlineGoogle, AiOutlineTwitter, AiOutlineUpload } from 'react-icons/ai';
import { AvatarUpload } from '@components/user/avatar-upload';
import { CoverUpload } from '@components/user/cover-upload';
import { IPerformerCategory } from '@interfaces/performer-category';
import { showError, showSuccess, validateMessages } from '@lib/message';
import { authService } from '@services/auth.service';
import { performerService } from '@services/performer.service';
import { settingService } from '@services/setting.service';
import {
  Button, Checkbox, Col, DatePicker,
  Form, Input, Modal,
  Popover, Progress, Row, Select, Upload
} from 'antd';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import React, { useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { COUNTRIES } from 'src/constants/countries';
import useCountdown from 'src/hooks/use-countdown';
import { IPerformer } from 'src/interfaces';
import { GENDERS, SEXUAL_ORIENTATIONS } from 'src/constants';
import HtmlVideolayer from '@components/video/player/html-player';
import style from './accountFrom.module.scss';

const WYSIWYG = dynamic(() => import('src/wysiwyg'), {
  ssr: false
});

const { Option } = Select;

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

interface IProps {
  user: IPerformer;
  categories: IPerformerCategory[];
}

export default function PerformerAccountForm({
  user, categories
}: IProps) {
  const _bio = useRef(user?.bio || '');
  const numCountdown = 60;
  const { countTime, setCountdown } = useCountdown();

  const { data: session, update: updateUser } = useSession();
  const [submiting, setSubmiting] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [uploadVideoPercentage, setUploadVideoPercentage] = useState(0);
  const [previewVideoUrl, setPreviewVideoUrl] = useState(user?.welcomeVideoPath || '');
  const [previewVideoName, setPreviewVideoName] = useState(user?.welcomeVideoName || '');
  const [isShowPreview, setIsShowPreview] = useState(false);
  const [mensurement, setMensurement] = useState<any>([]);
  const [updating, setUpdating] = useState(false);
  const intl = useIntl();
  const handleVideoChange = (info: any) => {
    info.file && info.file.percent && setUploadVideoPercentage(info.file.percent);
    if (info.file.status === 'uploading') {
      setIsUploadingVideo(true);
      return;
    }
    if (info.file.status === 'done') {
      showSuccess(intl.formatMessage({ id: 'yourVideoHasBeenUploaded', defaultMessage: 'Your video has been uploaded' }));
      setIsUploadingVideo(false);
      setPreviewVideoUrl(info?.file?.response?.data.url);
      setPreviewVideoName(info?.file?.response?.data.name);
    }
  };

  const beforeUploadVideo = (file) => {
    const isValid = file.size / 1024 / 1024 < (Number(process.env.MAX_SIZE_TEASER) || 200);
    if (!isValid) {
      showError(intl.formatMessage({
        id: 'fileToLarge',
        defaultMessage: `File is too large please provide a file ${process.env.MAX_SIZE_TEASER || 5}MB or below`
      }, {
        size: process.env.MAX_SIZE_TEASER || 5
      }));
      return false;
    }
    setPreviewVideoName(file.name);
    return true;
  };

  const onAvatarUploaded = (data: any) => {
    showSuccess(intl.formatMessage({ id: 'changesSaved', defaultMessage: 'Changes saved' }));
    updateUser({ info: { ...session?.user, avatar: data.response.data.url } });
  };

  const onCoverUploaded = (data: any) => {
    showSuccess(intl.formatMessage({ id: 'changesSaved', defaultMessage: 'Changes saved' }));
    updateUser({ info: { ...session?.user, cover: data.response.data.url } });
  };

  const verifyEmail = async () => {
    try {
      setSubmiting(true);
      const resp = await authService.verifyEmail({
        sourceType: 'performer',
        source: { _id: user._id, email: user.email }
      });
      setCountdown(numCountdown);
      resp?.data?.message && showSuccess(resp.data.message);
    } catch (e) {
      showError(e);
    } finally {
      setSubmiting(false);
    }
  };

  const updatePerformer = async (payload) => {
    const { _id } = payload;

    try {
      const updated = await performerService.updateMe(_id, payload);
      setUpdating(true);
      updateUser({ info: { ...session?.user, ...updated.data } });
      showSuccess(intl.formatMessage({ id: 'changesSaved', defaultMessage: 'Changes saved' }));
    } catch (e) {
      showError(e);
    } finally {
      setUpdating(false);
    }
  };

  const getMensurement = async () => {
    try {
      setSubmiting(true);
      const resp = await settingService.getGroup('mensurement');
      setMensurement(resp.data);
      setSubmiting(false);
    } catch (error) {
      showError(error);
    } finally {
      setSubmiting(false);
    }
  };

  const submit = (data: any) => {
    updatePerformer({
      ...user,
      ...data
    });
  };

  React.useEffect(() => {
  }, [_bio.current]);

  React.useEffect(() => {
    getMensurement();
  }, []);

  const initialValues = {
    ...user,
    dateOfBirth: (user?.dateOfBirth && dayjs(user?.dateOfBirth)) || ''
  };
  if (user && user.metaData) {
    user?.metaData
      && Object.entries(user?.metaData).map(([key, value]) => {
        if (value) {
          // eslint-disable-next-line no-return-assign
          return (
            initialValues[key] = value
          );
        }
        return undefined;
      });
  }

  return (
    <Form
      {...layout}
      onFinish={submit}
      validateMessages={validateMessages}
      initialValues={initialValues}
      scrollToFirstError
    >
      <div
        className={style['top-profile']}
        style={{
          position: 'relative',
          marginBottom: 25,
          backgroundImage:
            user?.cover
              ? `url('${user?.cover}')`
              : 'url(\'/default-banner.jpeg\')'
        }}
      >
        <div className={style['avatar-upload']}>
          <AvatarUpload
            uploadUrl={performerService.getAvatarUploadUrl()}
            onUploaded={onAvatarUploaded}
            image={user?.avatar}
          />
        </div>
        <div className={style['cover-upload']}>
          <CoverUpload
            uploadUrl={performerService.getCoverUploadUrl()}
            onUploaded={onCoverUploaded}
            options={{ fieldName: 'cover' }}
          />
        </div>
      </div>
      <Row>
        <Col md={12} xs={24}>
          <Form.Item
            name="firstName"
            label={intl.formatMessage({
              id: 'firstName',
              defaultMessage: 'First name'
            })}
            validateTrigger={['onChange', 'onBlur']}
            rules={[
              {
                required: true,
                message: intl.formatMessage(
                  { id: 'pleaseInputYourFirstName', defaultMessage: 'Please input your first name!' }
                )
              },
              {
                pattern: /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u,
                message: intl.formatMessage(
                  { id: 'validateFirstName', defaultMessage: 'First name cannot contain number and special character' }
                )
              }
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item
            name="lastName"
            label={intl.formatMessage({
              id: 'lastName',
              defaultMessage: 'Last name'
            })}
            validateTrigger={['onChange', 'onBlur']}
            rules={[
              {
                required: true,
                message: intl.formatMessage(
                  { id: 'pleaseInputYourLastName', defaultMessage: 'Please input your last name!' }
                )
              },
              {
                pattern: /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u,
                message: intl.formatMessage(
                  { id: 'validateLastName', defaultMessage: 'Last name cannot contain number and special character' }
                )
              }
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item
            name="name"
            label={intl.formatMessage({
              id: 'displayName',
              defaultMessage: 'Display name'
            })}
            validateTrigger={['onChange', 'onBlur']}
            rules={[
              {
                required: true,
                message: intl.formatMessage(
                  { id: 'pleaseInputYourDisplayName', defaultMessage: 'Please input your display name' }
                )
              },
              {
                pattern: /^(?=.*\S).+$/g,
                message: intl.formatMessage(
                  { id: 'displayNameCanNot', defaultMessage: 'Display name cannot contain only whitespace' },
                  { key: 'Display Name' }
                )
              },
              {
                min: 3,
                message: intl.formatMessage(
                  { id: 'displayNameMustContaint', defaultMessage: 'Display name must containt at least 3 characters' }
                )
              }
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item
            name="username"
            label={intl.formatMessage({
              id: 'username',
              defaultMessage: 'Username'
            })}
            validateTrigger={['onChange', 'onBlur']}
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'pleaseInputYourUsername',
                  defaultMessage: 'Please input your username!'
                })
              },
              {
                pattern: /^[a-zA-Z0-9]+$/g,
                message: intl.formatMessage({
                  id: 'usernameMustContainLowercaseAlphanumerics',
                  defaultMessage: 'Username must contain lowercase alphanumerics only'
                })
              },
              {
                min: 3,
                message: intl.formatMessage({
                  id: 'usernameMustContaintCharacters',
                  defaultMessage: 'Username must containt at least 3 characters'
                })
              }
            ]}
          >
            <Input placeholder="user1, john99,..." />
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item
            name="email"
            label={(
              <span style={{ fontSize: 10 }}>
                {intl.formatMessage({ id: 'emailAddress', defaultMessage: 'Email address' })}
                {'  '}
                {user?.verifiedEmail ? (
                  <Popover
                    title={intl.formatMessage({
                      id: 'emailNotVerified',
                      defaultMessage: 'Your email hasn\'t been verified'
                    })}
                    content={null}
                  >
                    <a className="success-color">{intl.formatMessage({ id: 'verified', defaultMessage: 'Verified!' })}</a>
                  </Popover>
                ) : (
                  <Popover
                    title={intl.formatMessage({
                      id: 'emailNotVerified',
                      defaultMessage: 'Your email hasn\'t been verified'
                    })}
                    content={(
                      <Button
                        type="primary"
                        onClick={() => verifyEmail()}
                        disabled={submiting || countTime < 60}
                        loading={submiting || countTime < 60}
                      >
                        {intl.formatMessage({
                          id: 'clickGetVerificationLink',
                          // eslint-disable-next-line no-template-curly-in-string
                          defaultMessage: `Click here to ${countTime < 60 ? 'resend' : 'send'} the verification link ${countTime < 60 && `${countTime}s`}`
                        }, {
                          send: countTime < 60 ? 'resend' : 'send',
                          time: countTime < 60 && `${countTime}s`
                        })}
                      </Button>
                    )}
                  >
                    <a className="error-color">{intl.formatMessage({ id: 'notVerified', defaultMessage: 'Not verified!' })}</a>
                  </Popover>
                )}
              </span>
            )}
            rules={[
              {
                type: 'email',
                message: intl.formatMessage({
                  id: 'invalidEmailAddress',
                  defaultMessage: 'Invalid email address!'
                })
              },
              {
                required: true,
                message: intl.formatMessage({
                  id: 'pleaseInpurYourEmailAddress',
                  defaultMessage: 'Please input your email address!'
                })
              }]}
            validateTrigger={['onChange', 'onBlur']}
          >
            <Input disabled={user?.googleConnected} />
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item
            name="gender"
            label={intl.formatMessage({ id: 'gender', defaultMessage: 'Gender' })}
            rules={[
              {
                required: true,
                message: intl.formatMessage(
                  { id: 'pleaseSelectYourGender', defaultMessage: 'Please select your gender' },
                  { key: 'gender!' }
                )
              }]}
          >
            <Select>
              {GENDERS.map((s) => (
                <Select.Option key={s.value} value={s.value}>
                  {s.text}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item name="categoryIds" label={intl.formatMessage({ id: 'categories', defaultMessage: 'Categories' })}>
            <Select showSearch mode="multiple">
              {categories?.map((s) => (
                <Select.Option key={s._id} value={s._id}>
                  {s.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item
            name="sexualOrientation"
            label={intl.formatMessage({ id: 'sexualOrientation', defaultMessage: 'Sexual orientation' })}
          >
            <Select>
              {SEXUAL_ORIENTATIONS.map((s) => (
                <Select.Option key={s.value} value={s.value}>
                  {s.text}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item
            name="country"
            label={intl.formatMessage({ id: 'country', defaultMessage: 'Country' })}
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              optionFilterProp="label"
            >
              {COUNTRIES.map((c) => (
                <Option value={c.code} label={c.name} key={c.code}>
                  <img alt="country_flag" src={c.flag} width="25px" />
                  {' '}
                  {c.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item
            label={intl.formatMessage({ id: 'dateOfBirth', defaultMessage: 'Date of Birth' })}
            name="dateOfBirth"
            validateTrigger={['onChange', 'onBlur']}
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'selectYourDateOfBirth', defaultMessage: 'Select your date of birth' })
              }
            ]}
          >
            <DatePicker
              style={{ width: '100%' }}
              placeholder="DD/MM/YYYY"
              format="DD/MM/YYYY"
              disabledDate={(currentDate) => currentDate > dayjs().subtract(18, 'year').startOf('day') && currentDate < dayjs().subtract(100, 'year').startOf('day')}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="bio"
            label={intl.formatMessage({ id: 'bio', defaultMessage: 'Bio' })}
            rules={[
              {
                required: true,
                message: intl.formatMessage(
                  { id: 'pleaseInputBio', defaultMessage: 'Please input your bio' }
                )
              }
            ]}
            extra={intl.formatMessage({ id: 'tellPeopleSomething', defaultMessage: 'Tell people something about you...' })}
          >
            <WYSIWYG content={_bio.current} onChange={(html) => { _bio.current = html; }} />
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item
            label={intl.formatMessage({ id: 'newPassword', defaultMessage: 'New Password' })}
            name="password"
            rules={[
              {
                pattern: /^(?=.{8,})(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[^\w\d]).*$/g,
                message: intl.formatMessage({ id: 'passwordMustHaveMinimum', defaultMessage: 'Password must have minimum 8 characters, at least 1 number, 1 uppercase letter, 1 lowercase letter & 1 special character' })
              }
            ]}
          >
            <Input.Password placeholder={intl.formatMessage({ id: 'enterPasswordPlacehoder', defaultMessage: 'Enter new password here' })} />
          </Form.Item>
          <p
            className="text-center"
            style={{ fontSize: '10px', fontWeight: 'lighter' }}
          >
            {intl.formatMessage({ id: 'keepBlankPassword', defaultMessage: 'Keep it blank for current password' })}
          </p>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item
            label={intl.formatMessage({ id: 'confirmNewPassword', defaultMessage: 'Confirm new password' })}
            name="confirm"
            dependencies={['password']}
            rules={[
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  // eslint-disable-next-line prefer-promise-reject-errors
                  return Promise.reject(intl.formatMessage({ id: 'passwordsDoNotTogether', defaultMessage: 'Passwords do not match together!' }));
                }
              })
            ]}
          >
            <Input.Password placeholder="Confirm new password" />
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item name="state" label={intl.formatMessage({ id: 'state', defaultMessage: 'State' })}>
            <Input />
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item name="city" label={intl.formatMessage({ id: 'city', defaultMessage: 'City' })}>
            <Input />
          </Form.Item>
        </Col>
        <Col lg={24} md={24} xs={24}>
          <Form.Item name="address" label={intl.formatMessage({ id: 'address', defaultMessage: 'Address' })}>
            <Input />
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item name="zipcode" label={intl.formatMessage({ id: 'zipcode', defaultMessage: 'Zip Code' })}>
            <Input />
          </Form.Item>
        </Col>

        {user && user?.metaData && mensurement.length ? (
          mensurement.map((m) => (
            <Col md={12} xs={24}>
              <Form.Item name={m.key} label={intl.formatMessage({ id: m.name })}>
                <Select>
                  {m?.value.length && m.value.map((v, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <Select.Option key={`mensurement_${i}`} value={v}>
                      {v}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          ))
        ) : null}

        <Col md={12} xs={24}>
          <Form.Item label={intl.formatMessage({ id: 'introVideo', defaultMessage: 'Intro Video' })}>
            <Upload
              accept={'video/*'}
              name="welcome-video"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action={performerService.getVideoUploadUrl()}
              headers={{ authorization: authService.getToken() }}
              beforeUpload={(file) => beforeUploadVideo(file)}
              onChange={handleVideoChange}
            >
              <AiOutlineUpload />
            </Upload>
            <div className="ant-form-item-explain" style={{ textAlign: 'left' }}>
              {((previewVideoUrl || previewVideoName) && <a aria-hidden onClick={() => setIsShowPreview(true)}>{previewVideoName || previewVideoUrl || 'Click here to preview'}</a>)
                || (
                  <a>
                    {intl.formatMessage(
                      { id: 'introVideoIs', defaultMessage: `Intro video is ${process.env.MAX_SIZE_TEASER || 200}MB or below` },
                      { size: process.env.MAX_SIZE_TEASER || 200 }
                    )}
                  </a>
                )}
            </div>
            {uploadVideoPercentage ? (
              <Progress percent={Math.round(uploadVideoPercentage)} />
            ) : null}
          </Form.Item>
          <Form.Item name="activateWelcomeVideo" valuePropName="checked">
            <Checkbox style={{ color: '#fff' }}>{intl.formatMessage({ id: 'activateIntroVideo', defaultMessage: 'Activate intro video' })}</Checkbox>
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          {user?.twitterConnected && (
            <Form.Item>
              <p className="black-color">
                <AiOutlineTwitter style={{ color: '#1ea2f1', fontSize: '30px' }} />
                {' '}
                {intl.formatMessage({ id: 'signupLoginTwitter', defaultMessage: 'Signup/login via Twitter' })}
              </p>
            </Form.Item>
          )}
          {user?.googleConnected && (
            <Form.Item>
              <p className="black-color">
                <AiOutlineGoogle style={{ color: '#d64b40', fontSize: '30px' }} />
                {' '}
                {intl.formatMessage({ id: 'signupLoginGoogle', defaultMessage: 'Signup/login via Google' })}
              </p>
            </Form.Item>
          )}
        </Col>
      </Row>
      <Form.Item className="text-center">
        <Button
          className="primary"
          type="primary"
          htmlType="submit"
          loading={isUploadingVideo}
          disabled={updating || isUploadingVideo}
        >
          {intl.formatMessage({ id: 'saveChanges', defaultMessage: 'Save Changes' })}
        </Button>
      </Form.Item>
      {isShowPreview && (
        <Modal
          width={767}
          footer={null}
          onOk={() => setIsShowPreview(false)}
          onCancel={() => setIsShowPreview(false)}
          open={isShowPreview}
          destroyOnClose
          centered
        >
          <HtmlVideolayer
            videoSrc={previewVideoUrl}
            priority={false}
          />
        </Modal>
      )}
    </Form>
  );
}
