'use client';

import PageHeading from '@components/common/page-heading';
import VideoUploadList from '@components/file/video-upload-list';
import { showError, showSuccess, validateMessages } from '@lib/message';
import { videoService } from '@services/video.service';
import {
  Button, Form, message, Upload
} from 'antd';
import {
  useEffect, useReducer, useState
} from 'react';
import { AiOutlineUpload } from 'react-icons/ai';
import { useIntl } from 'react-intl';

import { IUser } from '@interfaces/user';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import style from './bulk-upload.module.scss';

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};
const { Dragger } = Upload;

export default function BulkUploadVideo() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [, forceUpdate] = useReducer((s) => s + 1, 0);
  const intl = useIntl();
  const { data: session } = useSession();
  const user: IUser = session?.user as IUser;

  const onUploading = (file, resp: any) => {
    // eslint-disable-next-line no-param-reassign
    file.percent = resp.percentage;
    forceUpdate();
  };

  const beforeUpload = (file, listFile) => {
    if (file.size / 1024 / 1024 > (Number(process.env.MAX_SIZE_VIDEO) || 2000)) {
      showError(
        intl.formatMessage(
          {
            id: 'fileTooLarge',
            defaultMessage: '{fileName} is over {maxSize}MB'
          },
          { fileName: file.name, maxSize: Number(process.env.MAX_SIZE_VIDEO) || 2000 }
        )
      );
      return false;
    }
    setFileList([...fileList, ...listFile.filter((f) => f.size / 1024 / 1024 < (Number(process.env.MAX_SIZE_VIDEO) || 2000))]);
    return true;
  };

  const remove = (file) => {
    setFileList(fileList.filter((f) => f.uid !== file.uid));
  };

  const submit = async () => {
    const uploadFiles = fileList.filter((f) => !['uploading', 'done'].includes(f.status));
    if (!uploadFiles.length) {
      showError(intl.formatMessage({ id: 'pleaseSelectVideos', defaultMessage: 'Please select videos' }));
      return;
    }
    setUploading(true);
    // eslint-disable-next-line no-restricted-syntax
    for (const file of uploadFiles) {
      try {
        // eslint-disable-next-line no-continue
        if (['uploading', 'done'].includes(file.status)) continue;
        file.status = 'uploading';
        // eslint-disable-next-line no-await-in-loop
        await videoService.uploadVideo(
          [
            {
              fieldname: 'video',
              file
            }
          ],
          {
            title: file.name,
            price: 0,
            description: '',
            tags: [],
            participantIds: [user._id],
            isSale: false,
            isSchedule: false,
            status: 'inactive'
          },
          (r) => onUploading(file, r)
        );
        file.status = 'done';
      } catch (e) {
        file.status = 'error';
        showError(
          intl.formatMessage(
            {
              id: 'fileError',
              defaultMessage: 'File {fileName} error!'
            },
            { fileName: file.name }
          )
        );
      }
    }
    showSuccess(intl.formatMessage({ id: 'videosHaveBeenUploaded', defaultMessage: 'Videos have been uploaded!' }));
    router.push('/my-post');
  };

  useEffect(() => {
    if (!user.verifiedDocument) {
      message.warning(intl.formatMessage({ id: 'yourIdDocumentsAreNot', defaultMessage: 'Your ID documents are not verified yet! You could not post any content right now.' }));
      router.back();
    }
  }, []);

  return (
    <div className="main-container">
      <PageHeading title={intl.formatMessage({ id: 'uploadVideos', defaultMessage: 'Upload Videos' })} icon={<AiOutlineUpload />} />
      <div className={style['video-form']}>
        <Form
          {...layout}
          onFinish={submit}
          validateMessages={validateMessages}
          scrollToFirstError
        >
          <Form.Item>
            <Dragger
              accept="video/*"
              beforeUpload={beforeUpload}
              multiple
              showUploadList={false}
              disabled={uploading}
              listType="picture"
            >
              <p className="ant-upload-drag-icon">
                <span>
                  <AiOutlineUpload style={{ fontSize: '40px' }} />
                </span>
              </p>
              <p className="ant-upload-text">
                {intl.formatMessage({ id: 'dragDropYourVideo', defaultMessage: 'Click here or drag & drop your VIDEO files to this area to upload' })}
              </p>
            </Dragger>
          </Form.Item>
          <VideoUploadList
            files={fileList}
            remove={remove}
          />
          <Form.Item>
            <Button
              className="secondary"
              htmlType="submit"
              loading={uploading}
              disabled={uploading || !fileList.length}
            >
              {intl.formatMessage({ id: 'uploadAll', defaultMessage: 'UPLOAD ALL' })}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
