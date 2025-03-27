'use client';

import { ImageUpload } from '@components/file';
import { authService, performerService } from '@services/index';
import {
  Col, Form, Image, Row
} from 'antd';
import { useEffect, useState } from 'react';
import { IPerformer } from 'src/interfaces';
import classNames from 'classnames';
import { useIntl } from 'react-intl';
import { showSuccess } from '@lib/message';
import { useSession } from 'next-auth/react';
import style from './verificationForm.module.scss';

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

interface IProps {
  user: IPerformer;
}

export function PerformerVerificationForm({ user }: IProps) {
  const [idImage, setIdImage] = useState('');
  const [documentImage, setDocumentImage] = useState('');
  const { update } = useSession();
  const intl = useIntl();

  useEffect(() => {
    if (user.documentVerification) {
      setDocumentImage(user?.documentVerification?.url);
    }
    if (user.idVerification) {
      setIdImage(user?.idVerification?.url);
    }
  }, []);

  const onFileUploaded = (type, file) => {
    if (file && type === 'idFile') {
      setIdImage(file?.response?.data.url);
      update({
        info: {
          ...user,
          idVerification: {
            ...user.idVerification,
            url: file?.response?.data.url,
            _id: file?.response?.data._id

          }
        }
      });
    }
    if (file && type === 'documentFile') {
      setDocumentImage(file?.response?.data.url);
      update({
        info: {
          ...user,
          documentVerification: {
            ...user.documentVerification,
            url: file?.response?.data.url,
            _id: file?.response?.data._id

          }
        }
      });
    }
    showSuccess(intl.formatMessage({ id: 'uploadPhotoSuccess', defaultMessage: 'Photo has been uploaded!' }));
  };

  const documentUploadUrl = performerService.getDocumentUploadUrl();
  const headers = {
    authorization: authService.getToken()
  };
  return (
    <Form
      {...layout}
      name="nest-messages"
      labelAlign="left"
    >
      <Row>
        <Col xs={24} sm={24} md={12}>
          <Form.Item
            labelCol={{ span: 24 }}
            label={intl.formatMessage({ id: 'governmentYourId', defaultMessage: 'Your government issued ID' })}
            className={classNames(
              style['model-photo-verification']
            )}
          >
            <div className={style['document-upload']}>
              <ImageUpload
                accept="image/*"
                headers={headers}
                uploadUrl={`${documentUploadUrl}/idVerificationId`}
                onUploaded={(f) => onFileUploaded('idFile', f)}
              />
              {idImage ? (
                <Image alt="id-img" src={idImage} style={{ height: '150px' }} />
              ) : <img src="/front-id.png" height="150px" alt="id-img" />}
            </div>
            <div className="ant-form-item-explain" style={{ textAlign: 'left' }}>
              <ul className={style['list-issued-id']}>
                <li>{intl.formatMessage({ id: 'governmentId', defaultMessage: 'Government-issued ID card' })}</li>
                <li>{intl.formatMessage({ id: 'nationalId', defaultMessage: 'National Id card' })}</li>
                <li>{intl.formatMessage({ id: 'passport', defaultMessage: 'Passport' })}</li>
                <li>{intl.formatMessage({ id: 'drivingLicense', defaultMessage: 'Driving license' })}</li>
              </ul>
            </div>
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12}>
          <Form.Item
            labelCol={{ span: 24 }}
            label={intl.formatMessage({ id: 'yourSelfieWithYour', defaultMessage: 'Your selfie with your ID and handwritten note' })}
            className={classNames(
              style['model-photo-verification']
            )}
          >
            <div className={style['document-upload']}>
              <ImageUpload
                accept="image/*"
                headers={headers}
                uploadUrl={`${documentUploadUrl}/documentVerificationId`}
                onUploaded={(f) => onFileUploaded('documentFile', f)}
              />
              {documentImage ? (
                <Image alt="id-img" src={documentImage} style={{ height: '150px' }} />
              ) : <img src="/holding-id.png" height="150px" alt="holding-id" />}
            </div>
            <div className="ant-form-item-explain" style={{ textAlign: 'left' }}>
              <ul className={style['list-issued-id']}>
                <li>
                  {intl.formatMessage({ id: 'writeNoteWithDate', defaultMessage: 'On a blank piece of white paper write your name, today\'s date and our website address' })}
                  {' '}
                  {window.location.hash}
                </li>
                <li>{intl.formatMessage({ id: 'holdPaperWithId', defaultMessage: 'Hold your paper and your ID so we can clearly see hoth' })}</li>
                <li>{intl.formatMessage({ id: 'takeSelfie', defaultMessage: 'Take a selfie of you, your ID and your handwritten note. All three elements (you, your ID and your writting) must be clearly visible without copying or editing' })}</li>
              </ul>
            </div>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}

export default PerformerVerificationForm;
