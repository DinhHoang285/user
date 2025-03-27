import { AiOutlineCamera, AiOutlineLoading } from 'react-icons/ai';
import { authService } from '@services/auth.service';
import { showError } from '@lib/message';
import { Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import style from './avatar-upload.module.scss';

interface IProps {
  image?: string;
  uploadUrl?: string;
  onUploaded?: Function;
}

export function AvatarUpload({
  image, uploadUrl, onUploaded
}: IProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>(image || '/no-avatar.jpg');
  const intl = useIntl();

  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  function beforeUpload(file) {
    const isLt2M = file.size / 1024 / 1024 < (Number(process.env.MAX_SIZE_IMAGE) || 5);
    if (!isLt2M) {
      showError(
        intl.formatMessage(
          {
            id: 'avatarSizeError',
            defaultMessage: 'Avatar must be less than {maxSize}MB'
          },
          { maxSize: Number(process.env.MAX_SIZE_IMAGE) || 5 }
        )
      );
    }

    return isLt2M;
  }

  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url: string) => {
        setImageUrl(url);
        setLoading(false);
        onUploaded
          && onUploaded({
            response: info.file.response,
            base64: url
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
    img.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(img.outerHTML);
  };

  return (
    <div className={`${style['image-crop']} upload-avatar__customize`}>
      <ImgCrop
        rotationSlider
        cropShape="round"
        quality={1}
        modalTitle={intl.formatMessage({
          id: 'editAvatar',
          defaultMessage: 'Edit avatar'
        })}
        modalWidth={767}
        modalClassName={style['custom-img-crop-modal']}
      >
        <Upload
          accept="image/*"
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          action={uploadUrl}
          beforeUpload={beforeUpload}
          onChange={handleChange}
          onPreview={onPreview}
          headers={{ authorization: authService.getToken() }}

        >
          <img
            src={imageUrl}
            alt="avatar"
            style={{
              width: '100%', height: '100%', maxWidth: 104, maxHeight: 104
            }}
          />
          {loading ? <AiOutlineLoading /> : (
            <AiOutlineCamera style={{
              fontSize: '25px', position: 'absolute', right: '1px', bottom: '1px'
            }}
            />
          )}
        </Upload>
      </ImgCrop>
    </div>
  );
}

AvatarUpload.defaultProps = {
  onUploaded: () => { },
  uploadUrl: '',
  image: ''
};
