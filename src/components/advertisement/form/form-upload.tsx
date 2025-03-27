'use client';

import {
  AiOutlineCamera, AiOutlineDelete, AiOutlineFileDone, AiOutlineVideoCamera
} from 'react-icons/ai';
import { showError, validateMessages } from '@lib/message';
import { videoService } from '@services/index';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Progress,
  Row,
  Select,
  Switch,
  Upload
} from 'antd';
import classNames from 'classnames';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IPerformer, IVideo } from 'src/interfaces/index';
import { useIntl } from 'react-intl';
import ImageWithFallback from '@components/common/images/image-fallback';
import style from './form-upload.module.scss';

const HtmlVideolayer = dynamic(() => (import('@components/video/player/html-player')));

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

interface IProps {
  user: IPerformer;
  video?: IVideo;
  submit: Function;
  beforeUpload: Function;
  uploading: boolean;
  uploadPercentage: number;
}

export function FormUploadAdvertisement(props: IProps) {
  const intl = useIntl();
  const router = useRouter();
  const [previewThumbnail, setPreviewThumbnail] = useState(null);
  const [previewVideo, setPreviewVideo] = useState(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isSchedule, setIsSchedule] = useState(false);
  const [scheduledAt, setScheduledAt] = useState(dayjs());
  const [isShowPreview, setIsShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewType, setPreviewType] = useState('');
  const [removedThumbnail, setRemovedThumbnail] = useState(false);

  useEffect(() => {
    const { video } = props;
    if (video) {
      setPreviewThumbnail(video?.thumbnail);
      setPreviewVideo(video?.video);
      setIsSchedule(video.isSchedule);
      setScheduledAt(video.scheduledAt ? dayjs(video.scheduledAt) : dayjs());
    }
  }, []);

  const handleRemoveFile = async (field: string) => {
    if (!window.confirm(intl.formatMessage({
      id: 'confirmToRemoveFile',
      defaultMessage: 'Confirm to remove file!'
    }))) return;
    const { video } = props;
    try {
      await videoService.deleteFile(video._id, field);
      if (field === 'thumbnail') {
        setRemovedThumbnail(true);
      }
    } catch (e) {
      showError(e);
    }
  };

  const beforeUpload = (file: File, field: string) => {
    const { beforeUpload: beforeUploadHandler } = props;
    if (field === 'thumbnail') {
      const isValid = file.size / 1024 / 1024 < (Number(process.env.MAX_SIZE_IMAGE) || 5);
      if (!isValid) {
        showError(
          intl.formatMessage({
            id: 'imageToLarge',
            defaultMessage: `Image is too large please provide a image ${Number(process.env.MAX_SIZE_IMAGE) || 5}MB or below`
          }, { size: Number(process.env.MAX_SIZE_IMAGE) || 5 })
        );
        return isValid;
      }
      setSelectedThumbnail(file);
      setPreviewThumbnail(URL.createObjectURL(file));
    }
    if (field === 'video') {
      const isValid = file.size / 1024 / 1024 < (Number(process.env.MAX_SIZE_VIDEO) || 2000);
      if (!isValid) {
        showError(
          intl.formatMessage({
            id: 'fileToLarge',
            defaultMessage: `ile is too large please provide a file ${Number(process.env.MAX_SIZE_VIDEO) || 2000}MB or below`
          }, { size: Number(process.env.MAX_SIZE_VIDEO) || 2000 })
        );
        return isValid;
      }
      setSelectedVideo(file);
    }
    return beforeUploadHandler(file, field);
  };

  const {
    video, submit, uploading, uploadPercentage
  } = props;

  return (
    <div className={classNames(style['video-form'])}>
      <Form
        {...layout}
        onFinish={(values) => {
          const data = { ...values };
          if (isSchedule) {
            data.scheduledAt = scheduledAt;
          }
          if (values.tags && values.tags.length) {
            data.tags = values.tags.map((tag) => tag.replace(/[^a-zA-Z0-9 ]/g, '_'));
          }
          submit(data);
        }}
        name="form-upload"
        validateMessages={validateMessages}
        initialValues={
          video || {
            title: '',
            description: '',
            tags: [],
            isSale: false,
            isSchedule: false,
            status: 'active'
          }
        }
        scrollToFirstError
      >
        <Row>
          <Col md={24} xs={24}>
            <Form.Item
              label={<span>{intl.formatMessage({ id: 'title', defaultMessage: 'Title' })}</span>}
              name="title"
              rules={[{ required: true, message: intl.formatMessage({ id: 'pleaseInputTitle', defaultMessage: 'Please input title of video!' }) }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col md={24} xs={24}>
            <Form.Item
              label={<span>{intl.formatMessage({ id: 'redirectLink', defaultMessage: 'Redirect Link' })}</span>}
              name="redirectLink"
              rules={[]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col md={12} xs={24}>
            <Form.Item label={<span>{intl.formatMessage({ id: 'tags', defaultMessage: 'Tags' })}</span>} name="tags">
              <Select mode="tags" style={{ width: '100%' }} size="middle" showArrow={false} defaultValue={video?.tags || []} />
            </Form.Item>
          </Col>
          <Col md={12} xs={24}>
            <Form.Item
              name="status"
              label={<span>{intl.formatMessage({ id: 'status', defaultMessage: 'Status' })}</span>}
              rules={[{ required: true, message: intl.formatMessage({ id: 'pleaseSelectStatus', defaultMessage: 'Please select status!' }) }]}
            >
              <Select>
                <Select.Option key="active" value="active">
                  <span>{intl.formatMessage({ id: 'active', defaultMessage: 'Active' })}</span>
                </Select.Option>
                <Select.Option key="inactive" value="inactive">
                  <span>{intl.formatMessage({ id: 'inactive', defaultMessage: 'Inactive' })}</span>
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col md={12} xs={24}>
            <Form.Item name="ordering" label={<span>{intl.formatMessage({ id: 'ordering', defaultMessage: 'Ordering' })}</span>}>
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col md={12} xs={24}>
            <Form.Item name="isSchedule" label={<span>{intl.formatMessage({ id: 'schedule', defaultMessage: 'Scheduled?' })}</span>}>
              <Switch
                checkedChildren={<span>{intl.formatMessage({ id: 'schedule', defaultMessage: 'Scheduled' })}</span>}
                unCheckedChildren={<span>{intl.formatMessage({ id: 'notSchedule', defaultMessage: 'Not Scheduled' })}</span>}
                checked={isSchedule}
                onChange={(val) => setIsSchedule(val)}
              />
            </Form.Item>
            {isSchedule && (
              <Form.Item label={<span>{intl.formatMessage({ id: 'scheduledFor', defaultMessage: 'Scheduled for' })}</span>}>
                <DatePicker
                  style={{ width: '100%' }}
                  disabledDate={(currentDate) => currentDate && currentDate < dayjs().endOf('day')}
                  defaultValue={scheduledAt}
                  onChange={(val) => setScheduledAt(dayjs(val))}
                />
              </Form.Item>
            )}
          </Col>
          <Col span={24}>
            <Form.Item name="description" label={<span>{intl.formatMessage({ id: 'description', defaultMessage: 'Description' })}</span>}>
              <Input.TextArea rows={3} />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              label={<span>{intl.formatMessage({ id: 'video', defaultMessage: 'Video' })}</span>}
              className={classNames(style['upload-bl'])}
              help={
                (previewVideo && (
                  <a
                    aria-hidden
                    onClick={() => {
                      setIsShowPreview(true);
                      setPreviewUrl(previewVideo?.url);
                      setPreviewType('video');
                    }}
                  >
                    <span>{previewVideo?.name || intl.formatMessage({ id: 'clickToPreview', defaultMessage: 'Click here to preview' })}</span>
                  </a>
                ))
                || (selectedVideo && <a><span>{selectedVideo.name}</span></a>)
                || <span>{intl.formatMessage({ id: 'videoFileLimit', defaultMessage: `Video file is ${Number(process.env.MAX_SIZE_VIDEO) || 2048} MB or below` }, { size: Number(process.env.MAX_SIZE_VIDEO) || 2048 })}</span>
              }
            >
              <Upload
                customRequest={() => false}
                listType="picture-card"
                className="avatar-uploader"
                accept="video/*"
                multiple={false}
                showUploadList={false}
                disabled={uploading}
                beforeUpload={(file) => beforeUpload(file, 'video')}
              >
                {selectedVideo ? (
                  <span><AiOutlineFileDone /></span>
                ) : (
                  <span><AiOutlineVideoCamera /></span>
                )}
              </Upload>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              className={classNames(style['upload-bl'])}
              label={<span>{intl.formatMessage({ id: 'thumbnail', defaultMessage: 'Thumbnail' })}</span>}
              help={
                (previewThumbnail && !removedThumbnail && (
                  <a
                    aria-hidden
                    onClick={() => {
                      setIsShowPreview(true);
                      setPreviewUrl(previewThumbnail?.url);
                      setPreviewType('thumbnail');
                    }}
                  >
                    <span>{previewThumbnail?.name || intl.formatMessage({ id: 'clickToPreview', defaultMessage: 'Click here to preview' })}</span>
                  </a>
                ))
                || (selectedThumbnail && <a><span>{selectedThumbnail.name}</span></a>)
                || <span>{intl.formatMessage({ id: 'thumbnailFileLimit', defaultMessage: `Thumbnail is ${Number(process.env.MAX_SIZE_IMAGE) || 5}MB or below` }, { size: Number(process.env.MAX_SIZE_IMAGE) || 5 })}</span>
              }
            >
              <Upload
                listType="picture-card"
                className="avatar-uploader"
                accept="image/*"
                multiple={false}
                showUploadList={false}
                disabled={uploading}
                beforeUpload={(file) => beforeUpload(file, 'thumbnail')}
              >
                {selectedThumbnail ? (
                  <span><AiOutlineFileDone /></span>
                ) : (
                  <span><AiOutlineCamera /></span>
                )}
              </Upload>
              {video?.thumbnailId && !removedThumbnail && (
                <Button
                  className={style['remove-btn']}
                  type="primary"
                  onClick={() => handleRemoveFile('thumbnail')}
                >
                  <span><AiOutlineDelete /></span>
                </Button>
              )}
            </Form.Item>
          </Col>
        </Row>
        {uploadPercentage ? (
          <Progress percent={Math.round(uploadPercentage)} />
        ) : null}
        <Form.Item wrapperCol={{ ...layout.wrapperCol }} className={style['button-form']} style={{ padding: '0 5px' }}>
          <Button
            className="primary"
            htmlType="submit"
            loading={uploading}
            disabled={uploading}
          >
            <span>{video ? intl.formatMessage({ id: 'update', defaultMessage: 'Update' }) : intl.formatMessage({ id: 'upload', defaultMessage: 'Upload' })}</span>
          </Button>
          <Button
            className="secondary"
            onClick={() => router.back()}
            disabled={uploading}
          >
            <span>{intl.formatMessage({ id: 'back', defaultMessage: 'Back' })}</span>
          </Button>
        </Form.Item>
      </Form>
      {isShowPreview && (
        <Modal
          width={767}
          footer={null}
          onOk={() => setIsShowPreview(false)}
          onCancel={() => setIsShowPreview(false)}
          open={isShowPreview}
          destroyOnClose
        >
          {['teaser', 'video'].includes(previewType) && (
            <HtmlVideolayer
              videoSrc={previewUrl}
              thumbUrl={null}
              priority={false}
              aspectRatio="unset"
            />
          )}
          {previewType === 'thumbnail' && (
            <ImageWithFallback
              options={{
                width: 200,
                height: 200,
                style: { borderRadius: 5, width: '100%', objectFit: 'cover' }
              }}
              src={previewUrl || '/leaf.jpg'}
              alt="thumbnail"
            />
          )}
        </Modal>
      )}
    </div>
  );
}
