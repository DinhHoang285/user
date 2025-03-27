'use client';

import { showError } from '@lib/message';
import { Upload } from 'antd';
import { useState } from 'react';
import { AiFillCamera } from 'react-icons/ai';
import { useIntl } from 'react-intl';

interface IProps {
  onFileReaded?: Function;
}

export default function ImageUploadModel({ onFileReaded = () => {} }: IProps) {
  const intl = useIntl();
  const [imageUrl, setImageUrl] = useState('/no-avatar.jpg');

  return (
    <Upload
      customRequest={() => false}
      accept="image/*"
      name="file"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      beforeUpload={(file) => {
        if (!file.type.includes('image')) {
          showError(
            intl.formatMessage({
              id: 'selectimageFile',
              defaultMessage: 'Please select image file'
            })
          );
          return false;
        }
        const isLt5M = file.size / 1024 / 1024 < Number(process.env.MAX_SIZE_IMAGE || 20);
        if (!isLt5M) {
          showError(
            intl.formatMessage(
              {
                id: 'imageUploadProvide',
                defaultMessage: 'Image is too large. Please provide an image {size}MB or below'
              },
              { size: process.env.MAX_SIZE_IMAGE || 20 }
            )
          );
          return false;
        }
        setImageUrl(URL.createObjectURL(file));
        onFileReaded(file);
        return true;
      }}
    >
      <img
        src={imageUrl}
        alt="avatar"
        loading="lazy"
        style={{
          width: '100%',
          height: '100%',
          maxWidth: 104,
          maxHeight: 104
        }}
      />
      <span>
        <AiFillCamera />
      </span>
    </Upload>
  );
}
