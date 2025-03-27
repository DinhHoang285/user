import { AiOutlineCamera, AiOutlineLoading } from 'react-icons/ai';
import { showError } from '@lib/message';
import { Upload } from 'antd';
import { useState } from 'react';
import { useIntl } from 'react-intl';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

interface IProps {
  accept?: string;
  imageUrl?: string;
  uploadUrl?: string;
  headers?: any;
  onUploaded?: Function;
  onFileReaded?: Function;
  options?: any;
}

export function ImageUpload({
  options = {},
  accept,
  headers,
  uploadUrl,
  imageUrl,
  onFileReaded,
  onUploaded
}: IProps) {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState(imageUrl);
  const intl = useIntl();

  const handleChange = (info: any) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      onFileReaded && onFileReaded(info.file.originFileObj);
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (_url: string) => {
        setUrl(_url);
        setLoading(false);
        onUploaded && onUploaded({
          response: info.file.response,
          base64: imageUrl
        });
      });
      setLoading(false);
      setUrl(info.file.response.data ? info.file.response.data.url : intl.formatMessage({ id: 'done', defaultMessage: 'Done' }));
    }
  };

  const beforeUpload = (file) => {
    const isLt2M = file.size / 1024 / 1024 < (Number(process.env.MAX_SIZE_FILE) || 100);
    if (!isLt2M) {
      showError(intl.formatMessage({
        id: 'fileToLarge',
        defaultMessage: `File is too large please provide a file ${Number(process.env.MAX_SIZE_IMAGE) || 5}MB or below`
      }, {
        size: Number(process.env.MAX_SIZE_IMAGE) || 5
      }));
    }
    return isLt2M;
  };

  const uploadButton = (
    <div>
      {loading ? <AiOutlineLoading /> : <AiOutlineCamera />}
    </div>
  );
  return (
    <Upload
      accept={accept || 'image/*'}
      name={options.fieldName || 'file'}
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      action={uploadUrl}
      beforeUpload={(file) => beforeUpload(file)}
      onChange={handleChange}
      headers={headers}
    >
      {url ? (
        <img src={url} alt="file" style={{ width: '100%' }} />
      ) : (
        uploadButton
      )}
    </Upload>
  );
}

ImageUpload.defaultProps = {
  accept: null,
  options: {},
  imageUrl: '',
  uploadUrl: '',
  headers: {},
  onUploaded: () => { },
  onFileReaded: () => { }
};
