/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import Emotions from '@components/common/emotions';
import { IFeed } from '@interfaces/feed';
import { IUser } from '@interfaces/user';
import { formatDate } from '@lib/date';
import { convertBlobUrlToFile } from '@lib/file';
import { showError, showSuccess } from '@lib/message';
import { checkFileSize } from '@lib/utils';
import { feedService } from '@services/feed.service';
import { performerService } from '@services/performer.service';
import { photoService } from '@services/photo.service';
import {
  Avatar,
  Button,
  Col,
  Form, Input,
  InputNumber,
  Popover,
  Row,
  Select
} from 'antd';
import { debounce } from 'lodash';
import moment from 'moment';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import {
  useEffect, useReducer, useRef, useState
} from 'react';
import { AiOutlineClose, AiOutlineDelete, AiOutlineSmile } from 'react-icons/ai';
import { DateIcon } from 'src/icons';
import { useIntl } from 'react-intl';
import FeedButton from './button/box-button';
import style from './feed-form.module.scss';
import HeaderFeedForm from './header-feed-form';

const PreviewAudio = dynamic(() => import('@components/feed/upload/previews/audio'), { ssr: false });
const UploadProduct = dynamic(() => import('./button/upload-product'), { ssr: false });
const UploadShort = dynamic(() => import('./button/upload-short'), { ssr: false });
const ModalRecord = dynamic(() => import('./button/modal-record'), { ssr: false });
const BoxPoll = dynamic(() => import('./button/box-poll'), { ssr: false });
const ModalSetPrice = dynamic(() => import('./button/modal-price'), { ssr: false });

interface IProps {
  feed?: IFeed
}
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

export default function FeedForm({ feed }: IProps) {
  const intl = useIntl();
  const { data: session } = useSession();
  const user: IUser = session?.user as IUser;
  const formRef = useRef(null);
  const [filesFeed, setFilesFeed] = useState(feed?.files || []);
  const [filesFeedIds, setFilesFeedIds] = useState(feed ? (feed?.fileIds || [feed?.fileId]) : ([]));
  const [haveFile, setHaveFile] = useState(false);
  const [thumbnail, setThumbnail] = useState(feed?.thumbnail?.thumbnails[0] || (feed?.files ? feed?.files[0]?.thumbnails[0] : null) || feed?.video?.thumbnails[0] || null);
  const [teaser, setTeaser] = useState(feed?.teaser || null);
  const [showFileRecord, setShowFileRecord] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [thumbnailTeaser, setThumbnailTeaser] = useState(feed?.teaser?.thumbnails[0] || null);
  const [modalSetPrice, setModalSetPrice] = useState(false);
  const [modalRecord, setModalRecord] = useState(false);
  const [pollList, setPollList] = useState(feed?.polls || []);
  const [pollIds, setPollIds] = useState(feed?.pollIds || []);
  const [expiredPollAt, setExpiredPollAt] = useState(moment().endOf('day').add(7, 'days'));
  const [expirePollTime, setExpirePollTime] = useState(7);
  const [addPoll, setAddPoll] = useState(false);
  const [openPollDuration, setOpenPollDuration] = useState(false);
  const [listPerformerParticipant, setListPerformerParticipant] = useState([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);

  const [formData, setFormData] = useState<any>({
    text: feed?.text || feed?.description || '',
    title: feed?.title || '',
    price: feed?.price || 0,
    isSale: feed?.isSale || false,
    isSub: feed?.isSub || false,
    isFree: feed?.isFree || true,
    status: 'active',
    teaserId: feed?.teaserId || null,
    thumbnailId: feed?.thumbnailId || null,
    fileIds: feed?.fileIds || [],
    type: feed?.type || 'text',
    scheduledAt: feed?.scheduledAt ? new Date(feed?.scheduledAt) : null,
    isSchedule: feed?.isSchedule || false,
    tags: feed?.tags || [],
    participantIds: feed?.participantIds || [user?._id],
    tweet: feed?.tweet || false,
    stock: 1,
    productType: 'physical'
  });

  const [dataRecord, setDataRecord] = useState({
    item: null,
    blob: null,
    url: feed?.files && feed?.files.length > 0 ? feed?.files[0].url : null,
    fileRecord: null
  });

  const [dataDigital, setDataDigital] = useState({
    item: null,
    id: null,
    blob: null,
    url: feed?.digitalFileUrl || null
  });

  const router = useRouter();

  const onEmojiClick = (emoji: any) => {
    (formRef.current as any).setFieldValue('text', `${formData.text} ${emoji}`);
    setFormData({ ...formData, text: `${formData.text} ${emoji}` });
  };

  const remove = async (file) => {
    if (filesFeed.length === 1) {
      setHaveFile(false);
      if (['text', 'photo', 'video', 'audio'].includes(formData.type)) {
        setFormData({ ...formData, type: 'text' });
      }
    }
    setFilesFeed(filesFeed.filter(
      (f) => f?._id !== file?._id || f?.uid !== file?.uid
    ));
    setFilesFeedIds(filesFeedIds.filter((id) => id !== file?._id));
  };

  const showResult = (data) => {
    const newdate = new Date(data);
    const formattedDate = formatDate(newdate, 'D MMM YYYY hh:mm');
    const hours = newdate.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    return `${formattedDate} ${ampm}`;
  };

  const beforeUploadThumbnail = async (file) => {
    const checkFile = checkFileSize(file.size, 'image');
    if (!checkFile) return false;
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      setThumbnail(reader.result);
    });
    reader.readAsDataURL(file);
    try {
      setUploading(true);
      const resp: any = (await feedService.uploadThumbnail(
        file,
        {},
        () => { }
      )) as any;
      setFormData({ ...formData, thumbnailId: resp.data._id });
    } catch (e) {
      showError(
        intl.formatMessage(
          { id: 'thumbnailFileError', defaultMessage: `Thumbnail file ${file.name} error!` },
          { fileName: file.name }
        )
      );
    } finally {
      setUploading(false);
    }
    return true;
  };

  const beforeUploadTeaser = async (file) => {
    const checkFile = checkFileSize(file?.size, 'teaser');
    if (!checkFile) return false;
    try {
      setUploading(true);
      const resp = (await feedService.uploadTeaser(
        file,
        {},
        () => { }
      )) as any;
      setFormData({ ...formData, teaserId: resp.data._id });
    } catch (e) {
      showError(
        intl.formatMessage(
          { id: 'teaserFileError', defaultMessage: `Teaser file ${file.name} error!` },
          { fileName: file.name }
        )
      );
    } finally {
      setUploading(false);
    }
    return true;
  };

  const beforeUpload = async (file, listFile: any) => {
    if (file.type.includes('image') && formData.type === 'text') {
      setFormData({ ...formData, type: 'photo', teaserId: null });
      setTeaser(null);
    }
    if (file.type.includes('image') && formData.type === 'product') {
      setFormData({ ...formData, type: 'product' });
    }
    if (file.type.includes('video') && formData.type === 'text') {
      setFormData({ ...formData, type: 'video' });
    }
    if (file.type.includes('video') && formData.type === 'reel') {
      setFormData({ ...formData, type: 'reel' });
    }
    if (file.type.includes('audio')) {
      setFormData({ ...formData, type: 'audio' });
    }

    if (listFile?.indexOf(file) === listFile.length - 1) {
      listFile.forEach((f: any) => {
        if (!(f as any).type.includes('image')) return f;
        // eslint-disable-next-line no-param-reassign
        f.thumbnail = URL.createObjectURL(f);
        return f;
      });

      setFilesFeed([...listFile, ...filesFeed]);
    }
  };

  const beforeUploadRecord = async (file) => {
    const _file = file
      && (await convertBlobUrlToFile(
        file,
        `record_audio_${new Date().getTime()}`
      ));
    setFormData({ ...formData, type: 'audio' });
    setDataRecord({
      ...dataRecord, item: { ..._file, url: file }, url: file, fileRecord: [_file]
    });
  };

  const onUploading = (_file, resp: any) => {
    const updatedFile = { ..._file, percent: resp.percentage };
    if (updatedFile.percent === 100) updatedFile.status = 'done';
    forceUpdate();
  };

  const processUploadRecord = async () => {
    let _fIds;
    if (dataRecord?.fileRecord.length > 0) {
      await dataRecord.fileRecord.reduce(async (lp, fileItem) => {
        await lp;
        if (!['uploading', 'done'].includes(fileItem.status) && !fileItem._id) {
          try {
            const result = fileItem;
            result.status = 'uploading';
            let resp: any = {};

            resp = await feedService.uploadAudio(result, {}, (r) => onUploading(result, r));

            _fIds = [resp.data._id];
            result._id = resp.data._id;
          } catch (e) {
            showError(e);
          }
        }
        return Promise.resolve();
      }, Promise.resolve());
    }
    return { _fIds };
  };

  const getPerformers = debounce(async (q, performerIds = '') => {
    try {
      const resp = await performerService.search({
        q,
        performerIds: performerIds || '',
        limit: 99
      });
      setListPerformerParticipant(resp.data.data);
    } catch (e) {
      showError(e);
    }
  }, 500);

  const submit = async (payload: any) => {
    if (!user?.verifiedDocument || !user?.verifiedAccount) {
      showError(intl.formatMessage({ id: 'yourAccountIsNotVerifiedID', defaultMessage: 'Your account is not verified ID documents yet! You could not post any content right now.' }));
      return;
    }
    if (!filesFeed.length && (!formData.text.length && !formData.title.length) && formData.type === 'text') {
      showError(intl.formatMessage({ id: 'theFeedHasNoContent', defaultMessage: 'The feed has no content' }));
      return;
    }

    if (formData.type === 'product' && !filesFeed.length) {
      showError(intl.formatMessage({ id: 'pleaseUploadProductImage', defaultMessage: 'Please upload product image' }));
      return;
    }

    if ((!formData.text.length && !formData.title.length) && formData.type === 'product') {
      showError(intl.formatMessage({ id: 'pleaseWriteContent', defaultMessage: 'Please write content' }));
      return;
    }

    if (formData.productType === 'digital' && dataDigital.item === null && formData.type === 'product') {
      showError(intl.formatMessage({ id: 'pleaseUploadDigitalFile', defaultMessage: 'Please upload digital file' }));
      return;
    }

    if (formData.type !== 'text' && !formData.title.length) {
      showError(intl.formatMessage({ id: 'titleRequired', defaultMessage: 'Title required' }));
      return;
    }

    if (formData.type === 'product' && !formData.price) {
      showError(intl.formatMessage({ id: 'priceRequired', defaultMessage: 'Please enter product price' }));
      return;
    }

    await setUploading(true);
    // upload media

    let _fileIds = filesFeedIds;
    const newPollIds = [...pollIds];

    if (formData.type === 'audio' && !thumbnail) {
      showError(intl.formatMessage({ id: 'pleaseUploadThumbnail', defaultMessage: 'Please upload thumbnail' }));
      setUploading(false);
      return;
    }

    if (filesFeed.length >= 1) {
      await filesFeed.reduce(async (lp, fileItem) => {
        await lp;
        if (!['uploading', 'done'].includes(fileItem.status) && !fileItem._id) {
          try {
            const result = fileItem;
            result.status = 'uploading';
            let resp: any = {};
            if (formData.type === 'photo' || formData.type === 'product') {
              resp = await feedService.uploadPhoto(result, {}, () => { });
              _fileIds = [..._fileIds, ...[resp.data._id]];
            } else if (formData.type === 'video' || formData.type === 'reel') {
              resp = await feedService.uploadVideo(result, {}, () => { });
              _fileIds = [resp.data._id];
            } else if (formData.type === 'audio') {
              resp = await feedService.uploadAudio(result, {}, () => { });
              _fileIds = [resp.data._id];
            }
            result._id = resp.data._id;
          } catch (e) {
            showError(`File ${fileItem.name} error!`);
          }
        }
        return Promise.resolve();
      }, Promise.resolve());
    } else if (payload.text === undefined) {
      showError(intl.formatMessage({ id: 'theFeedHasNoContent', defaultMessage: 'The feed has no content' }));
      setUploading(false);
      return;
    }

    if (addPoll && pollList.length < 2) {
      showError(intl.formatMessage({ id: 'pollsMustHaveAtLeast2Options', defaultMessage: 'Polls must have at least 2 options' }));
      return;
    }

    if (addPoll && pollList.length >= 2) {
      await setUploading(true);
      // eslint-disable-next-line no-restricted-syntax
      for (const poll of pollList) {
        try {
          // eslint-disable-next-line no-continue
          if (!poll || poll._id) continue;

          // eslint-disable-next-line no-await-in-loop
          const resp = await feedService.addPoll({
            description: poll,
            expiredAt: expiredPollAt
          });
          if (resp?.data?._id) {
            newPollIds.push(resp.data._id);
          }
        } catch (e) {
          showError('err_create_poll');
        }
      }

      setPollIds([...newPollIds]);
    }

    if (dataRecord && showFileRecord) {
      const { _fIds } = await processUploadRecord();
      _fileIds = _fIds;
    }

    if (feed) {
      const data = {
        ...payload, ...formData, fileIds: _fileIds, pollIds: newPollIds, pollExpiredAt: expiredPollAt
      };

      try {
        await feedService.update(feed._id, {
          ...data
        });
        showSuccess(intl.formatMessage({ id: 'updateSuccessfully', defaultMessage: 'Update Successfully' }));
        router.push('/my-post');
      } catch (error) {
        showError(error);
      } finally {
        setUploading(false);
      }
    } else {
      const data = {
        ...payload, ...formData, fileIds: _fileIds, pollIds: newPollIds, pollExpiredAt: expiredPollAt
      };

      try {
        await feedService.create({
          ...data
        });
        showSuccess(intl.formatMessage({
          id: 'postSuccess!',
          defaultMessage: 'Posted successfully!'
        }));
        router.push(`/${user?.username}`);
      } catch (error) {
        showError(intl.formatMessage({ id: 'postFail', defaultMessage: 'Post failed' }));
      } finally {
        setFilesFeed([]);
        setFilesFeedIds([]);
        setHaveFile(false);
        setThumbnail(null);
        setTeaser(null);
        setUploading(false);
        setThumbnailTeaser(null);
        setShowFileRecord(false);
        setDataRecord({
          item: null,
          blob: null,
          url: feed?.files && feed?.files.length > 0 ? feed?.files[0].url : null,
          fileRecord: null
        });
        setFormData({
          text: '',
          title: '',
          price: 0,
          isSale: false,
          isSub: false,
          isFree: true,
          status: 'active',
          teaserId: null,
          thumbnailId: null,
          fileIds: [],
          type: 'text',
          scheduledAt: null,
          stock: feed?.stock || 1,
          productType: feed?.productType || 'physical'
        });
      }
    }
  };

  return (
    <div>
      <HeaderFeedForm formData={formData} setFormData={setFormData} isEdit={!!feed} />
      <Form
        name="basic"
        ref={formRef}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        {...layout}
        onFinish={submit}
        scrollToFirstError
        className={style['feed-form']}
        initialValues={
          {
            title: '',
            text: '',
            price: 10,
            isSale: false,
            status: 'active',
            tags: [],
            participantIds: [user?._id],
            isSchedule: false
          }
        }
      >
        {formData.type === 'product' ? (
          <>
            <Form.Item
              name="type"
            >
              <div className={style['group-item']}>
                <p className={style.title}>
                  <span>{intl.formatMessage({ id: 'type', defaultMessage: 'Type' })}</span>
                </p>
                <div className={style.content}>
                  <Select
                    value={formData.productType}
                    onChange={(val) => {
                      setFormData({ ...formData, productType: val });
                    }}
                  >
                    <Select.Option key="physical" value="physical">
                      <span>{intl.formatMessage({ id: 'physical', defaultMessage: 'Physical' })}</span>

                    </Select.Option>
                    <Select.Option key="digital" value="digital">
                      <span>{intl.formatMessage({ id: 'digital', defaultMessage: 'Digital' })}</span>
                    </Select.Option>
                  </Select>
                </div>
              </div>
            </Form.Item>
            <Row>
              <Col md={12} xs={24} className={style.col}>
                <Form.Item
                  name="price"
                  rules={[
                    {
                      required: true,
                      message: intl.formatMessage({ id: 'pleaseAddThePrice', defaultMessage: 'Please add the price' })
                    }
                  ]}
                >
                  <div className={style['group-item']}>
                    <p className={style.title}>
                      <span>{intl.formatMessage({ id: 'price', defaultMessage: 'Price' })}</span>
                    </p>
                    <InputNumber
                      min={1}
                      value={formData.price}
                      style={{
                        width: '100%'
                      }}
                      onChange={(val) => {
                        setFormData({
                          ...formData, price: val, isFree: false, isSale: true, isSub: false
                        });
                      }}
                    />
                  </div>
                </Form.Item>
              </Col>
              {
                formData.productType === 'physical'
                && (
                  <Col md={12} xs={24} className={style.col}>
                    <Form.Item
                      name="stock"
                    >
                      <div className={style['group-item']}>
                        <p className={style.title}>
                          <span>{intl.formatMessage({ id: 'stock', defaultMessage: 'Stock' })}</span>
                        </p>
                        <InputNumber
                          min={1}
                          defaultValue={formData.stock}
                          style={{
                            width: '100%'
                          }}
                          onChange={(val) => {
                            setFormData({ ...formData, stock: val });
                          }}
                        />
                      </div>
                    </Form.Item>
                  </Col>
                )
              }
            </Row>
          </>
        ) : null}

        <Form.Item
          required
          name="title"
          validateTrigger={['onChange', 'onBlur']}
        >
          <div className={style['group-item']}>
            <p className={style.title}>
              <span>{intl.formatMessage({ id: 'title', defaultMessage: 'Title' })}</span>
            </p>
            <Input
              value={formData.title}
              defaultValue={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={style.input}
            />
          </div>
        </Form.Item>
        <Form.Item
          required
          name="text"
          validateTrigger={['onChange', 'onBlur']}
        >
          <div className={style['group-item']}>
            <Input.TextArea
              showCount
              defaultValue={formData.text}
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              className={style.inputArea}
              minLength={1}
              maxLength={300}
              rows={3}
              placeholder={
                !formData.text
                  ? intl.formatMessage({ id: 'composeNewPost', defaultMessage: 'Compose new post...' })
                  : intl.formatMessage({ id: 'addADescription', defaultMessage: 'Add a description' })
              }
              allowClear
            />
            <Popover
              className={`${style['icon-emotions']} emotion-popover`}
              content={<Emotions onEmojiClick={onEmojiClick} />}
              title={null}
              trigger="click"
            >
              <span className={style['grp-emotions']}>
                <AiOutlineSmile />
              </span>
            </Popover>
          </div>
        </Form.Item>
        {['text', 'photo', 'video', 'audio'].includes(formData.type) && (
          <BoxPoll
            feed={feed}
            addPoll={addPoll}
            setPollIds={setPollIds}
            setPollList={setPollList}
            setOpenPollDuration={setOpenPollDuration}
            expirePollTime={expirePollTime}
            setExpiredPollAt={setExpiredPollAt}
            setExpirePollTime={setExpirePollTime}
            pollList={pollList}
            openPollDuration={openPollDuration}
          />
        )}
        {
          formData.price || (formData.scheduledAt && formData.isSchedule) ? (
            <Form.Item required validateTrigger={['onChange', 'onBlur']}>
              <div className={style['box-price-calendar']}>
                {formData.scheduledAt ? (
                  <div className={style['total-calendar']}>
                    <div className={style['calendar-item']}>
                      <i>
                        <DateIcon />
                      </i>
                      <span>{showResult(formData.scheduledAt)}</span>
                      <i
                        aria-hidden
                        className={style.delete}
                        onClick={() => {
                          setFormData({ ...formData, scheduledAt: null, isSchedule: false });
                        }}
                      >
                        <span>
                          <AiOutlineClose style={{ display: 'flex', alignItems: 'center' }} />
                        </span>
                      </i>
                    </div>
                  </div>
                ) : null}
                {formData.price ? (
                  <div className={style['box-price']}>
                    €
                    {' '}
                    {formData.price}
                    <button
                      type="button"
                      className={style.delete}
                      onClick={() => {
                        setFormData({
                          ...formData, price: 0, isSale: false, isSub: false, isFree: true
                        });
                      }}
                    >
                      <span>
                        <AiOutlineClose style={{ display: 'flex', alignItems: 'center' }} />
                      </span>
                    </button>
                  </div>
                ) : null}
              </div>
            </Form.Item>
          ) : null
        }

        <Form.Item
          required
          validateTrigger={['onChange', 'onBlur']}
        >
          <div className={`${style['group-item']} ${style['box-action']}`}>
            <FeedButton
              files={filesFeed}
              onRemove={remove}
              onAddMore={beforeUpload}
              uploading={uploading}
              haveFile={haveFile}
              setHaveFile={setHaveFile}
              uploadTeaser={beforeUploadTeaser}
              setThumbnailTeaser={setThumbnailTeaser}
              uploadThumbnail={beforeUploadThumbnail}
              setModalSetPrice={setModalSetPrice}
              formData={formData}
              setFormData={setFormData}
              addPoll={addPoll}
              setAddPoll={setAddPoll}
              setPollList={setPollList}
              setModalRecord={setModalRecord}
              setShowFileRecord={setShowFileRecord}
              dataRecord={dataRecord}
              setDataRecord={setDataRecord}
              thumbnail={thumbnail}
              setThumbnail={setThumbnail}
              thumbnailTeaser={thumbnailTeaser}
              showFileRecord={showFileRecord}
              teaser={teaser}
            />
          </div>
        </Form.Item>
        {(dataRecord?.item && showFileRecord) && ['text', 'video', 'photo', 'audio'].includes(formData.type) ? (
          <Form.Item
            required
            validateTrigger={['onChange', 'onBlur']}
          >
            <div className={style['box-show-record']}>
              <div className={style['box-audio']}>
                <PreviewAudio url={dataRecord?.item?.url || dataRecord?.item} inModal />
              </div>
              <div className={style['box-delete']}>
                <div className={style['box-delete']}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowFileRecord(false);
                      setDataRecord({
                        item: null,
                        url: null,
                        fileRecord: null,
                        blob: null
                      });
                    }}
                  >
                    <span>
                      <AiOutlineDelete style={{ display: 'flex', alignItems: 'center' }} />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </Form.Item>
        ) : null}
        {formData.type === 'reel' ? (
          <UploadShort
            uploadFile={beforeUpload}
            remove={remove}
            thumbnail={thumbnail}
            setThumbnail={setThumbnail}
          />
        ) : null}
        {formData.type === 'product' ? (
          <UploadProduct
            formData={formData}
            isLoading={uploading}
            uploadFile={beforeUpload}
            thumbnail={thumbnail}
            feed={feed}
            dataDigital={dataDigital}
            setDataDigital={setDataDigital}
            files={filesFeed}
            setFilesFeed={setFilesFeed}
          />
        ) : null}
        {['text', 'video', 'photo', 'audio', 'reel'].includes(formData.type) ? (
          <>
            <Form.Item
              required
              className={style['attach-media']}
              name="tags"
              validateTrigger={['onChange', 'onBlur']}
            >
              <div className={style['group-item']}>
                <p className={style.title}>
                  <span>{intl.formatMessage({ id: 'tags', defaultMessage: 'Tags' })}</span>
                </p>
                <div className={style['input-f-desc']}>
                  <Select
                    mode="tags"
                    style={{ width: '100%' }}
                    size="middle"
                    // showArrow={false}
                    defaultValue={formData.tags}
                    onChange={(val) => setFormData({ ...formData, tags: val })}
                  />
                </div>
              </div>
            </Form.Item>
            <Form.Item
              required
              className={style['attach-media']}
              name="participantIds"
              validateTrigger={['onChange', 'onBlur']}
            >
              <div className={style['group-item']}>
                <p className={style.title}>
                  {intl.formatMessage({ id: 'participants', defaultMessage: 'Participants' })}
                </p>
                <div className={style['input-f-desc']}>
                  <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    showSearch
                    placeholder={intl.formatMessage({ id: 'searchCreatorHere', defaultMessage: 'Search creator here' })}
                    optionFilterProp="children"
                    onSearch={(q) => getPerformers(q)}
                    loading={uploading}
                    defaultValue={formData.participantIds}
                    onChange={(val) => setFormData({ ...formData, participantIds: val })}
                  >
                    {listPerformerParticipant
                      && listPerformerParticipant.length > 0
                      && listPerformerParticipant.map((p) => (
                        <Select.Option key={p._id} value={p._id}>
                          <Avatar src={p?.avatar || '/no-avatar.jpg'} />
                          {' '}
                          {p?.name || p?.username || 'N/A'}
                        </Select.Option>
                      ))}
                  </Select>
                </div>
              </div>
            </Form.Item>
          </>
        ) : null}

        <Form.Item label={null} className={style['box-button-submit']}>
          <Button
            disabled={uploading}
            className={style['btn-cancel']}
            onClick={() => router.back()}
          >
            <span>{intl.formatMessage({ id: 'cancel', defaultMessage: 'Cancel' })}</span>
          </Button>
          <Button disabled={uploading} type="default" htmlType="submit" className={style['btn-submit']}>
            <span>{intl.formatMessage({ id: 'createPost', defaultMessage: 'Create Post' })}</span>
          </Button>
        </Form.Item>
      </Form>
      {modalSetPrice && (
        <ModalSetPrice
          isModalOpen={modalSetPrice}
          setIsModalOpen={setModalSetPrice}
          setFormData={setFormData}
          formData={formData}
        />
      )}
      {
        modalRecord && (
          <ModalRecord
            isModalOpen={modalRecord}
            setIsModalOpen={setModalRecord}
            setFormData={setFormData}
            formData={formData}
            beforeUploadRecord={beforeUploadRecord}
            dataRecord={dataRecord}
            setDataRecord={setDataRecord}
            setShowFileRecord={setShowFileRecord}
          />
        )
      }
    </div>
  );
}
