import { IPerformer } from '@interfaces/index';
import { showError, showSuccess } from '@lib/message';
import { reportService } from '@services/report.service';
import {
  Button, Form, Input, Modal, Select
} from 'antd';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import ImageWithFallback from '@components/common/images/image-fallback';
import style from './report-form.module.scss';

type IProps = {
  performer: IPerformer;
  target: string;
  targetId: string;
  onClose: Function;
  open: boolean
}

function ReportForm({
  target,
  targetId,
  performer,
  onClose,
  open
}: IProps) {
  const [submiting, setsubmiting] = useState(false);
  const intl = useIntl();

  return (
    <Modal
      key="report_btn"
      className={`${style['form-report']} subscription-modal`}
      title={intl.formatMessage({
        id: 'report',
        defaultMessage: 'Report'
      })}
      open={open}
      footer={null}
      destroyOnClose
      onCancel={() => onClose()}
    >
      <div className="report-form">
        {performer && (
          <div className="text-center">
            <ImageWithFallback
              options={{
                unoptimized: true,
                width: 100,
                height: 100,
                sizes: '20vw',
                style: { borderRadius: '50%' }
              }}
              alt="avatar"
              src={performer?.avatar || '/no-avatar.jpg'}
              fallbackSrc="/no-avatar.jpg"
            />
          </div>
        )}
        <div className="info-body">
          <Form
            onFinish={async (values) => {
              try {
                setsubmiting(true);
                await reportService.create({
                  ...values,
                  target,
                  targetId,
                  performerId: performer?._id
                });
                showSuccess(intl.formatMessage({
                  id: 'reportHasSent',
                  defaultMessage: 'Your report has been sent'
                }));
                onClose();
              } catch (e) {
                showError(e);
              } finally {
                setsubmiting(false);
              }
            }}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            className="account-form"
            scrollToFirstError
            initialValues={{
              title: intl.formatMessage({
                id: 'violentOrRepulsiveContent',
                defaultMessage: 'Violent or repulsive content'
              }),
              description: ''
            }}
          >
            <Form.Item
              label={intl.formatMessage({
                id: 'title',
                defaultMessage: 'Title'
              })}
              name="title"
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({
                    id: 'pleaseSelectTitle',
                    defaultMessage: 'Please select a title'
                  })
                }
              ]}
              validateTrigger={['onChange', 'onBlur']}
            >
              <Select>
                <Select.Option
                  value={intl.formatMessage({
                    id: 'violentOrRepulsiveContent',
                    defaultMessage: 'Violent or repulsive content'
                  })}
                  key="Violent or repulsive content"
                >
                  {intl.formatMessage({
                    id: 'violentOrRepulsiveContent',
                    defaultMessage: 'Violent or repulsive content'
                  })}
                </Select.Option>
                <Select.Option
                  value={intl.formatMessage({
                    id: 'hatefulOrAbusiveContent',
                    defaultMessage: 'Hateful or abusive content'
                  })}
                  key="Hateful or abusive content"
                >
                  {intl.formatMessage({
                    id: 'hatefulOrAbusiveContent',
                    defaultMessage: 'Hateful or abusive content'
                  })}
                </Select.Option>
                <Select.Option
                  value={intl.formatMessage({
                    id: 'harassmentOrBullying',
                    defaultMessage: 'Harassment or bullying'
                  })}
                  key="Harassment or bullying"
                >
                  {intl.formatMessage({
                    id: 'harassmentOrBullying',
                    defaultMessage: 'Harassment or bullying'
                  })}
                </Select.Option>
                <Select.Option
                  value={intl.formatMessage({
                    id: 'harmfulOrDangerousActs',
                    defaultMessage: 'Harmful or dangerous acts'
                  })}
                  key="Harmful or dangerous acts"
                >
                  {intl.formatMessage({
                    id: 'harmfulOrDangerousActs',
                    defaultMessage: 'Harmful or dangerous acts'
                  })}
                </Select.Option>
                <Select.Option
                  value={intl.formatMessage({
                    id: 'childAbuse',
                    defaultMessage: 'Child abuse'
                  })}
                  key="Child abuse"
                >
                  {intl.formatMessage({
                    id: 'childAbuse',
                    defaultMessage: 'Child abuse'
                  })}
                </Select.Option>
                <Select.Option
                  value={intl.formatMessage({
                    id: 'promotesTerrism',
                    defaultMessage: 'Promotes terrorism'
                  })}
                  key="Promotes terrorism"
                >
                  {intl.formatMessage({
                    id: 'promotesTerrism',
                    defaultMessage: 'Promotes terrorism'
                  })}
                </Select.Option>
                <Select.Option
                  value={intl.formatMessage({
                    id: 'spamOrMisleading',
                    defaultMessage: 'Spam or misleading'
                  })}
                  key="Spam or misleading"
                >
                  {intl.formatMessage({
                    id: 'spamOrMisleading',
                    defaultMessage: 'Spam or misleading'
                  })}
                </Select.Option>
                <Select.Option
                  value={intl.formatMessage({
                    id: 'infringesMyRights',
                    defaultMessage: 'Infringes my rights'
                  })}
                  key="Infringes my rights"
                >
                  {intl.formatMessage({
                    id: 'infringesMyRights',
                    defaultMessage: 'Infringes my rights'
                  })}
                </Select.Option>
                <Select.Option
                  value={intl.formatMessage({
                    id: 'others',
                    defaultMessage: 'Others'
                  })}
                  key="Others"
                >
                  {intl.formatMessage({
                    id: 'others',
                    defaultMessage: 'Others'
                  })}
                </Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="description"
              label={intl.formatMessage({
                id: 'description',
                defaultMessage: 'Description'
              })}
              style={{ marginBottom: '20px' }}
            >
              <Input.TextArea
                placeholder={intl.formatMessage({
                  id: 'reasonReport',
                  defaultMessage: 'Tell us why you report?'
                })}
                minLength={20}
                showCount
                maxLength={100}
                rows={3}
              />
            </Form.Item>
            <Form.Item className="text-center">
              <Button
                className="primary"
                htmlType="submit"
                block
                loading={submiting}
                disabled={submiting}
              >
                {intl.formatMessage({
                  id: 'submit',
                  defaultMessage: 'Submit'
                })}
              </Button>
            </Form.Item>
          </Form>

        </div>
      </div>
    </Modal>
  );
}

export default ReportForm;
