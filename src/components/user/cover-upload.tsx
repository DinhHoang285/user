'use client';

import { AiOutlineEdit, AiOutlineLoading } from 'react-icons/ai';
import { authService } from '@services/auth.service';
import { showError } from '@lib/message';
import { Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import style from './avatar-upload.module.scss';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const intl = useIntl();
  const isLt2M = file.size / 1024 / 1024 < (Number(process.env.MAX_SIZE_IMAGE) || 5);
  if (!isLt2M) {
    showError(
      intl.formatMessage(
        {
          id: 'coverSizeError',
          defaultMessage: 'Cover must be less than {maxSize}MB'
        },
        { maxSize: Number(process.env.MAX_SIZE_IMAGE) || 5 }
      )
    );
  }
  return isLt2M;
}

interface IProps {
  uploadUrl?: string;
  onUploaded?: Function;
  options?: any;
}

export function CoverUpload({
  uploadUrl, onUploaded, options
}: IProps) {
  const [uploading, setUploading] = useState(false);
  const intl = useIntl();

  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setUploading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) => {
        setUploading(false);
        onUploaded
          && onUploaded({
            response: info.file.response,
            base64: imageUrl
          });
      });
    }
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const img = new Image();
    img.src = src || '/default-banner.jpeg';
    const imgWindow = window.open(src);
    imgWindow.document.write(img.outerHTML);
  };

  return (
    <ImgCrop
      aspect={1076 / 230}
      cropShape="rect"
      quality={1}
      modalTitle={intl.formatMessage({
        id: 'editCover',
        defaultMessage: 'Edit Cover'
      })}
      modalWidth={767}
      modalClassName={style['custom-img-crop-modal']}
    >
      <Upload
        accept="image/*"
        name={options.fieldName || 'file'}
        listType="picture-card"
        showUploadList={false}
        action={uploadUrl}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        onPreview={onPreview}
        headers={{ authorization: authService.getToken() }}
      >
        <span>
          {uploading ? <AiOutlineLoading /> : <AiOutlineEdit />}
          {' '}
          {intl.formatMessage({ id: 'editCover', defaultMessage: 'Edit cover' })}
        </span>
      </Upload>
    </ImgCrop>
  );
}

CoverUpload.defaultProps = {
  uploadUrl: '',
  onUploaded: '',
  options: {}
};

export default CoverUpload;
