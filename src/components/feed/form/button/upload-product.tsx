'use client';

import { IFile } from '@interfaces/file';
import { showError } from '@lib/message';
import {
  Col, Form, Row, Upload
} from 'antd';
import { AiOutlineDelete, AiOutlinePlus } from 'react-icons/ai';
import ImageWithFallback from '@components/common/images/image-fallback';
import { useIntl } from 'react-intl';
import style from './upload-product.module.scss';

interface IProps {
  formData: any;
  isLoading: boolean;
  uploadFile: Function;
  thumbnail: string;
  feed?: any;
  dataDigital: any;
  setDataDigital: Function;
  files: any;
  setFilesFeed: Function;
}

function UploadProduct({
  formData,
  setFilesFeed,
  isLoading,
  uploadFile,
  feed,
  dataDigital,
  setDataDigital,
  files
}: IProps) {
  const intl = useIntl();
  const beforeUpload = (file, fileList: IFile[] | any) => {
    const isValid = file.size / 1024 / 1024 < (Number(process.env.MAX_SIZE_FILE) || 100);
    if (!isValid) {
      showError(
        intl.formatMessage(
          {
            id: 'fileToLarge',
            defaultMessage: 'File is too large. Please provide a file of {size}MB or below.'
          },
          { size: Number(process.env.MAX_SIZE_FILE) || 100 }
        )
      );
      return false;
    }

    uploadFile(file, fileList);
    return isValid;
  };

  const beforeUploadDigitalFile = (file) => {
    const isValid = file.size / 1024 / 1024 < (Number(process.env.MAX_SIZE_FILE) || 100);
    if (!isValid) {
      showError(
        intl.formatMessage(
          { id: 'fileToLarge', defaultMessage: 'File is too large. Please provide a file of {size}MB or below.' },
          { size: Number(process.env.MAX_SIZE_FILE) || 100 }
        )
      );
      return false;
    }
    setDataDigital({ ...formData, item: file });
    return isValid;
  };

  return (
    <Row className={style.container}>
      <Col md={12} xs={12}>
        <Form.Item>
          <p className={style['form-item-title']}>{intl.formatMessage({ id: 'image', defaultMessage: 'Image' })}</p>
          <div className="upload">
            <Upload
              accept="image/*"
              listType="picture-card"
              multiple={false}
              showUploadList={false}
              disabled={isLoading || files.length}
              beforeUpload={beforeUpload}
              customRequest={() => false}
              className="product-uploader"
            >
              <div className="img-upload">
                {!files.length && (
                  <div className={style['box-upload']} style={{ marginTop: '22px' }}>
                    <i>
                      <AiOutlinePlus />
                    </i>
                    <p>
                      {intl.formatMessage({ id: 'addImage', defaultMessage: 'Add Image' })}
                    </p>
                  </div>
                )}
                {files.length ? (
                  <div className={style['box-image']}>
                    <ImageWithFallback
                      options={{
                        unoptimized: true,
                        style: { width: '100%' }
                      }}
                      src={(files[0].url ? files[0].url : files[0].thumbnail) || '/leaf.jpg'}
                      alt="file"
                    />
                    <button
                      type="button"
                      className={style['box-delete']}
                      onClick={(e) => {
                        e.preventDefault();
                        setFilesFeed([]);
                      }}
                    >
                      <AiOutlineDelete />
                    </button>
                  </div>
                ) : null}
              </div>
            </Upload>
          </div>
        </Form.Item>
      </Col>
      {formData.productType === 'digital' && formData.type === 'product' && (
        <Col md={12} xs={12}>
          <Form.Item style={{ marginLeft: '30px' }}>
            <p className={style['form-item-title']}>Digital File</p>
            <div className="upload">
              <Upload
                listType="picture-card"
                multiple={false}
                showUploadList={false}
                disabled={isLoading || dataDigital?.item}
                beforeUpload={(file) => beforeUploadDigitalFile(file)}
                customRequest={() => false}
              >
                {dataDigital?.item || feed?.digitalFileUrl ? (
                  <div className={style['box-image-digital']}>
                    <img
                      src="/file-checked.jpg"
                      alt="check"
                      style={{ maxWidth: '100%' }}
                    />
                    <button
                      type="button"
                      className={style['box-delete']}
                      onClick={(e) => {
                        e.preventDefault();
                        setDataDigital({ ...dataDigital, item: null });
                      }}
                    >
                      <AiOutlineDelete />
                    </button>
                  </div>
                ) : (
                  <div className={style['box-upload-digital']}>
                    <i>
                      <AiOutlinePlus />
                    </i>
                    <p>
                      {intl.formatMessage({ id: 'addimage', defaultMessage: 'Add Image' })}
                    </p>
                  </div>
                )}
              </Upload>
            </div>
            {feed?.digitalFileUrl && (
              <div className="ant-form-item-explain" style={{ textAlign: 'left' }}>
                <a download target="_blank" href={feed?.digitalFileUrl} rel="noreferrer">
                  {intl.formatMessage({ id: 'clickToDownload', defaultMessage: 'Click to Download' })}
                </a>
              </div>
            )}
          </Form.Item>
        </Col>
      )}
    </Row>
  );
}

export default UploadProduct;
