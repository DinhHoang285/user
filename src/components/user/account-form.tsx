/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import { AiOutlineGoogle, AiOutlineTwitter } from 'react-icons/ai';
import { AvatarUpload } from '@components/user/avatar-upload';
import { IUser } from '@interfaces/user';
import { showError, showSuccess } from '@lib/message';
import { authService } from '@services/auth.service';
import { userService } from '@services/user.service';
import {
  Button, Col, Form, Input, Popover, Row, Select, Switch
} from 'antd';
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useMainThemeLayout } from 'src/providers/main-layout.provider';
import style from './account-form.module.scss';

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

export default function UserAccountFormComponent() {
  const [updating, setUpdating] = useState<boolean>(false);
  const { data: session, update } = useSession();
  const user: IUser = session?.user as IUser;
  const { settings } = useMainThemeLayout();
  const [countTime, setCountTime] = useState(60);
  const countRef = useRef(null) as any;
  const intl = useIntl();

  const initialState = user?._id ? Object.assign(user, {
    enable2StepEmail: user?.enable2StepEmail && settings?.enable2StepEmail
  }, session?.user) : {};

  const updateUser = async (data) => {
    try {
      setUpdating(true);
      const updated = await userService.updateMe(data);

      update({ info: { ...session?.user, ...updated.data } });
      showSuccess(intl.formatMessage({ id: 'changesSaved', defaultMessage: 'Changes saved' }));
    } catch (e) {
      showError(e);
    } finally {
      setUpdating(false);
    }
  };

  const onFinish = (data) => {
    updateUser(data);
  };

  const uploadAvatar = (data) => {
    update({ info: { ...session?.user, avatar: data.response.data.url } });
  };

  const handleCountdown = () => {
    if (countTime === 0) {
      setCountTime(60);
      countRef.current && clearTimeout(countRef.current);
      return;
    }
    setCountTime((s) => s - 1);
    countRef.current = setTimeout(() => handleCountdown, 1000);
  };

  const verifyEmail = async () => {
    try {
      const resp = await authService.verifyEmail({
        sourceType: 'user',
        source: user
      });
      handleCountdown();
      showSuccess(resp.data.message);
    } catch (e) {
      showError(e);
    }
  };

  useEffect(() => () => {
    if (countRef.current) {
      clearTimeout(countRef.current);
      countRef.current = null;
    }
  }, [countTime]);

  return (
    <Form
      className={style['account-form']}
      {...layout}
      name="user-account-form"
      onFinish={onFinish}
      scrollToFirstError
      initialValues={initialState}
    >
      <Row>
        <Col xs={24} sm={12}>
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
                message: intl.formatMessage({
                  id: 'pleaseInputYourFirstName',
                  defaultMessage: 'Please input your first name!'
                })
              },
              {
                pattern: /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u,
                message: intl.formatMessage({
                  id: 'validateFirstName',
                  defaultMessage: 'First name can not contain number and special character'
                })
              }
            ]}
          >
            <Input placeholder={intl.formatMessage({
              id: 'firstName',
              defaultMessage: 'First name'
            })}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
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
                message: intl.formatMessage({ id: 'pleaseInputYourLastName!', defaultMessage: 'Please input your last name!' })
              },
              {
                pattern: /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u,
                message: intl.formatMessage({
                  id: 'validateLastName',
                  defaultMessage: 'Last name can not contain number and special character'
                })
              }
            ]}
          >
            <Input placeholder={intl.formatMessage({
              id: 'lastName',
              defaultMessage: 'Last name'
            })}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
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
            <Input placeholder="mirana, invoker123, etc..." />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            name="email"
            label={(
              <span style={{ fontSize: 10 }}>
                {intl.formatMessage({
                  id: 'emailAddress',
                  defaultMessage: 'Email address'
                })}
                &nbsp;
                {user?.verifiedEmail ? (
                  <Popover
                    title={intl.formatMessage({
                      id: 'emailVerified',
                      defaultMessage: 'Your email has been verified'
                    })}
                    content={null}
                  >
                    <a className="success-color">
                      {intl.formatMessage({
                        id: 'verified',
                        defaultMessage: 'Verified'
                      })}
                    </a>
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
                        disabled={!user?.email || countTime < 60}
                        loading={countTime < 60}
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
                    <a className="error-color">
                      {intl.formatMessage({
                        id: 'notVerified',
                        defaultMessage: 'Not Verified!'
                      })}
                    </a>
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
            <Input
              disabled={user?.verifiedEmail}
              type="email"
              placeholder={intl.formatMessage({
                id: 'emailAddress',
                defaultMessage: 'Email address'
              })}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
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
                message: intl.formatMessage({
                  id: 'pleaseInputYourDisplayName',
                  defaultMessage: 'Please input your display name!'
                })
              },
              {
                pattern: /^(?=.*\S).+$/g,
                message: intl.formatMessage({
                  id: 'displayNameCanNot',
                  defaultMessage: 'Display name can not contain only whitespace'
                })
              },
              {
                min: 3,
                message: intl.formatMessage({
                  id: 'displayNameMustContaint',
                  defaultMessage: 'Display name must containt at least 3 characters'
                })
              }
            ]}
          >
            <Input placeholder={intl.formatMessage({
              id: 'displayName',
              defaultMessage: 'Display name'
            })}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            name="gender"
            label={intl.formatMessage({
              id: 'gender',
              defaultMessage: 'Gender'
            })}
            rules={[{
              required: true,
              message: intl.formatMessage({
                id: 'pleaseSelectYourGender',
                defaultMessage: 'Please select your gender'
              })
            }]}
          >
            <Select>
              <Select.Option value="male" key="male">
                {intl.formatMessage({
                  id: 'male',
                  defaultMessage: 'Male'
                })}
              </Select.Option>
              <Select.Option value="female" key="female">
                {intl.formatMessage({
                  id: 'female',
                  defaultMessage: 'Female'
                })}
              </Select.Option>
              <Select.Option value="transgender" key="transgender">
                {intl.formatMessage({
                  id: 'trans',
                  defaultMessage: 'Trans'
                })}
              </Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item
            label={intl.formatMessage({
              id: 'password',
              defaultMessage: 'Password'
            })}
            name="password"
            rules={[
              {
                pattern: /^(?=.{8,})(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[^\w\d]).*$/g,
                message: intl.formatMessage({
                  id: 'passwordMustHaveMinimum',
                  defaultMessage: 'Password must have minimum 8 characters, at least 1 number, 1 uppercase letter, 1 lowercase letter & 1 special character'
                })
              }
            ]}
          >
            <Input.Password placeholder={intl.formatMessage({
              id: 'enterNewPassword',
              defaultMessage: 'Enter you new password here'
            })}
            />
          </Form.Item>
          <p
            className="text-center"
            style={{ fontSize: '10px', fontWeight: 'lighter' }}
          >
            {intl.formatMessage({
              id: 'keepBlankPassword',
              defaultMessage: 'Keep it blank for current password'
            })}
          </p>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item
            label={intl.formatMessage({
              id: 'confirmNewPassword',
              defaultMessage: 'Confirm new password'
            })}
            name="confirm-password"
            dependencies={['password']}
            rules={[
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(intl.formatMessage({
                    id: 'passwordsDoNotTogether',
                    defaultMessage: 'Passwords do not match together!'
                  }));
                }
              })
            ]}
          >
            <Input.Password placeholder={intl.formatMessage({
              id: 'confirmNewPassword',
              defaultMessage: 'Confirm new password'
            })}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item label={intl.formatMessage({
            id: 'avatar',
            defaultMessage: 'Avatar'
          })}
          >
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <AvatarUpload
                image={user?.avatar}
                uploadUrl={userService.getAvatarUploadUrl()}
                onUploaded={uploadAvatar}
              />
            </div>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label={intl.formatMessage({
              id: 'enable2StepAuthEmail',
              defaultMessage: 'Enable 2 Step Authentication with Email'
            })}
            name="enable2StepEmail"
            valuePropName="checked"
            extra={intl.formatMessage({
              id: 'enable2StepExtra',
              defaultMessage: 'If enabled, you need to verify the OTP code sent to your registered email'
            })}
            tooltip={
              !settings.enable2StepEmail
              && intl.formatMessage({
                id: 'adminDisableFeature',
                defaultMessage: 'Admin has disabled this feature'
              })
            }
          >

            <Switch
              checkedChildren="Enable"
              unCheckedChildren="Disable"
              disabled={!settings?.enable2StepEmail}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          {user?.twitterConnected && (
            <Form.Item>
              <p className="primary-color">
                <span>
                  <AiOutlineTwitter style={{ color: '#1ea2f1', fontSize: '30px' }} />
                  &nbsp;
                  {intl.formatMessage({
                    id: 'signupLoginTwitter',
                    defaultMessage: 'Signup/login via Twitter'
                  })}
                </span>
              </p>
            </Form.Item>
          )}
          {user?.googleConnected && (
            <Form.Item>
              <p className="primary-color">
                <span>
                  <AiOutlineGoogle style={{ color: '#d64b40', fontSize: '30px' }} />
                  &nbsp;
                  {intl.formatMessage({
                    id: 'signupLoginGoogle',
                    defaultMessage: 'Signup/login via Google'
                  })}
                </span>
              </p>
            </Form.Item>
          )}
        </Col>
      </Row>
      <Form.Item className="text-center" rootClassName="button-save">
        <Button className="primary" htmlType="submit">
          {intl.formatMessage({
            id: 'saveChanges',
            defaultMessage: 'Save Changes'
          })}
        </Button>
      </Form.Item>
    </Form>
  );
}
