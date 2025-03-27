import { Button, Upload } from 'antd';
import { useState } from 'react';
import { vaultService } from '@services/vault.service';
import { AiOutlineUpload } from 'react-icons/ai';
import { isMediaType } from '@lib/file';
import { useIntl } from 'react-intl';
import { showError, showSuccess } from '@lib/message';
import { useRouter } from 'next/navigation';
import styles from './vault.module.scss';

export default function FormVault() {
  const intl = useIntl();
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const beforeUpload = (file, files) => {
    if (file.type.includes('image')) {
      const valid = file.size / 1024 / 1024 < (Number(process.env.NEXT_PUBLIC_MAX_SIZE_IMAGE) || 5);
      if (!valid) {
        showError(intl.formatMessage({
          id: 'targetFileNameMustBeSmaller',
          defaultMessage: `Image ${file.name} must be smaller than ${Number(process.env.NEXT_PUBLIC_MAX_SIZE_IMAGE) || 5}MB!`
        }, {
          type: intl.formatMessage({ id: 'image', defaultMessage: 'Image' }),
          nameFile: file.name,
          size: Number(process.env.NEXT_PUBLIC_MAX_SIZE_IMAGE) || 5
        }));
        return false;
      }
    }
    if (file.type.includes('video')) {
      const valid = file.size / 1024 / 1024 < (Number(process.env.NEXT_PUBLIC_MAX_SIZE_TEASER) || 200);
      if (!valid) {
        showError(intl.formatMessage({
          id: 'targetFileNameMustBeSmaller',
          defaultMessage: `Video ${file.name} must be smaller than ${Number(process.env.NEXT_PUBLIC_MAX_SIZE_VIDEO || 5000)}MB!`
        }, {
          type: intl.formatMessage({ id: 'video', defaultMessage: 'Video' }),
          nameFile: file.name,
          size: process.env.NEXT_PUBLIC_MAX_SIZE_VIDEO || 200
        }));
        return false;
      }
    }
    setFileList(files);
    return true;
  };

  const submit = async () => {
    if (!fileList.length) {
      showError(
        intl.formatMessage({
          id: 'pleaseSelectFile',
          defaultMessage: 'Please select the file'
        })
      );
      return;
    }
    setUploading(true);

    await fileList.reduce(async (cb, fileItem) => {
      await cb;
      try {
        // eslint-disable-next-line no-await-in-loop
        (fileItem.type.includes('image')
          ? await vaultService.uploadPhoto(
            fileItem,
            {},
            () => { }
            // eslint-disable-next-line no-await-in-loop
          )
          : await vaultService.uploadVideo(fileItem, {}, () => { })) as any;
      } catch {
        setUploading(false);
        showError(
          intl.formatMessage(
            {
              id: 'fileError',
              defaultMessage: 'File {fileName} error!'
            },
            { fileName: fileItem.name }
          )
        );
      }
      return Promise.resolve();
    }, Promise.resolve());
    const isImageFile = isMediaType(fileList[0], 'image');
    setUploading(false);
    showSuccess(
      intl.formatMessage({
        id: 'targetUploaded',
        defaultMessage: `${isImageFile ? 'Images' : 'Videos'} have been uploaded!`
      }, {
        type: isImageFile ? intl.formatMessage({ id: 'image', defaultMessage: 'Image' }) : intl.formatMessage({ id: 'video', defaultMessage: 'Video' })
      })
    );
    router.push('/creator/my-vault');
  };

  return (
    <>
      <Upload
        className={styles['vault-upload']}
        accept="video/*,image/*"
        name="file"
        listType="picture"
        showUploadList={{ showPreviewIcon: false, showRemoveIcon: true, showDownloadIcon: false }}
        beforeUpload={beforeUpload}
      >
        <div
          className={styles['btn-upload']}
          style={{
            color: '#fff'
          }}
        >
          <span>
            <AiOutlineUpload />
            {intl.formatMessage({ id: 'clickToUpload', defaultMessage: 'Click to upload' })}
          </span>
        </div>
      </Upload>
      <Button
        className="primary"
        htmlType="submit"
        loading={uploading}
        disabled={uploading}
        onClick={() => submit()}
        style={{ marginTop: 10 }}
      >
        {intl.formatMessage({ id: 'submit', defaultMessage: 'SUBMIT' })}
      </Button>
    </>
  );
}
