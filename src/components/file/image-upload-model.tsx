import { showError } from '@lib/message';
import { Upload } from 'antd';
import { useState } from 'react';
import { AiOutlineCamera } from 'react-icons/ai';
import { useIntl } from 'react-intl';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

interface IProps {
  onFileReaded?: Function;
}

export function ImageUploadModel({ onFileReaded }: IProps) {
  const intl = useIntl();
  const [imageUrl, setImageUrl] = useState<string>('/no-avatar.jpg');

  const beforeUpload = (file) => {
    if (!file.type.includes('image')) {
      showError(intl.formatMessage({ id: 'selectimageFile', defaultMessage: 'Please select image file' }));
      return false;
    }
    const isLt5M = file.size / 1024 / 1024 < (Number(process.env.MAX_SIZE_IMAGE) || 20);
    if (!isLt5M) {
      showError(intl.formatMessage({
        id: 'fileToLarge',
        defaultMessage: `File is too large please provide a file ${Number(process.env.MAX_SIZE_IMAGE) || 5}MB or below`
      }, {
        size: Number(process.env.MAX_SIZE_IMAGE) || 5
      }));
      return false;
    }
    getBase64(file, (img: string) => {
      setImageUrl(img);
    });
    onFileReaded && onFileReaded(file);
    return true;
  };

  return (
    <Upload
      customRequest={() => false}
      accept="image/*"
      name="file"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      beforeUpload={(file) => beforeUpload(file)}
    >
      <img
        src={imageUrl}
        alt="avatar"
        style={{
          width: '100%',
          height: '100%',
          maxWidth: 104,
          maxHeight: 104
        }}
      />
      <AiOutlineCamera style={{
        transform: 'translate(10%, 50%)',
        backgroundColor: '#49AEE8',
        fontSize: '24px'
      }}
      />
    </Upload>
  );
}
