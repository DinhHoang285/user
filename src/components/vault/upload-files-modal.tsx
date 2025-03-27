/* eslint-disable no-nested-ternary */
import { AiOutlineCamera, AiOutlineLoading, AiOutlinePlayCircle } from 'react-icons/ai';
import { getImageURL } from '@lib/file';
import { authService } from '@services/auth.service';
import {
  Checkbox, Divider, Empty,
  Modal,
  Pagination, Upload
} from 'antd';
import { intersectionBy, uniqBy } from 'lodash';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { IVault } from 'src/interfaces';
import { showError } from '@lib/message';
import { vaultService } from '../../services/vault.service';
import styles from './vault.module.scss';

interface IProps {
  accept?: string;
  action?: string;
  onSubmit: Function;
  multiple?: boolean;
  vaultType?: string;
  btnLabel?: any;
  options?: any;
  disabled?: boolean;
  vaultExisted?: any;
  needDefaultOpen?: boolean;
  reset?: number;
  onOpenModal?: Function;
  onCloseModal?: Function;
  uploadFileRef?: any[];
  noVault?: boolean;
  setMediaType?: Function;
  setOpenUpload?: Function;
}

function UploadFilesModal({
  action,
  accept,
  onSubmit,
  multiple,
  vaultType,
  btnLabel,
  options,
  disabled,
  vaultExisted,
  needDefaultOpen,
  reset,
  onOpenModal,
  onCloseModal,
  uploadFileRef,
  noVault,
  setMediaType,
  setOpenUpload
}: IProps) {
  const intl = useIntl();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 12, total: 0 });
  const [vaults, setVaults] = useState<IVault[]>([] as any);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [openModal, setOpenModal] = useState(needDefaultOpen || false);

  const getVaults = async () => {
    try {
      setLoading(true);
      const { data } = await vaultService.search({
        type: vaultType || '',
        limit: pagination.pageSize,
        offset: (pagination.current - 1) * pagination.pageSize
      });
      setVaults(data.data);
      setPagination({ ...pagination, total: data.total });
    } catch (error) {
      const e = await error;
      showError(
        e?.message
          || intl.formatMessage({
            id: 'somethingWentWrong',
            defaultMessage: 'Something went wrong, please try again'
          })
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    openModal && !noVault && getVaults();
  }, [pagination.current, openModal, uploadFileRef]);

  useEffect(() => {
    const newUploadFiles = intersectionBy(uploadFiles, uploadFileRef, 'uid');
    setUploadFiles(newUploadFiles);
    if (Array.isArray(uploadFileRef)) {
      setSelectedItems((prev) => [...prev, ...uploadFileRef]);
    }
  }, [openModal, uploadFileRef]);

  useEffect(() => {
    if (vaultExisted) {
      setSelectedItems([{ ...vaultExisted, _id: vaultExisted.fileId, url: vaultExisted.fileUrl }]);
      setOpenModal(!!vaultExisted);
    }
  }, [vaultExisted]);

  useEffect(() => {
    needDefaultOpen && setOpenModal(needDefaultOpen);
  }, [needDefaultOpen]);

  useEffect(() => {
    setSelectedItems([]);
    setUploadFiles([]);
  }, [reset]);

  const handleSelect = (item: IVault) => {
    const data = { ...item, url: item.fileUrl, _id: item.fileId };
    const isSelected = !!selectedItems.find((i) => `${i?._id}` === `${data._id}`);
    switch (multiple) {
      case false:
        if (isSelected) {
          setSelectedItems([]);
        } else {
          setSelectedItems([data]);
        }
        break;
      case true:
        if (isSelected) {
          const result = selectedItems.filter((i) => `${i?._id}` !== `${data._id}`);
          setSelectedItems(result);
          break;
        } else {
          setSelectedItems(uniqBy([...selectedItems, data], (i) => i?._id || i?.uid));
        }
        break;
      default:
    }
  };

  const handleCancel = () => {
    setMediaType('text');
    setOpenUpload(false);
    setSelectedItems([]);
    setOpenModal(false);
    onCloseModal();
  };

  const handlePageChange = (page, pageSize) => setPagination({ ...pagination, current: page, pageSize });

  const handleSubmit = () => {
    if (!uploadFiles.length && !selectedItems.length) {
      setMediaType('text');
      setOpenUpload(false);
    }
    onSubmit(selectedItems);
    setOpenModal(false);
    onCloseModal();
  };

  const beforeUpload = (file, files) => {
    const fileType = file.type.includes('image')
      ? intl.formatMessage({ id: 'image', defaultMessage: 'Image' })
      : file.type?.includes('video')
        ? intl.formatMessage({ id: 'video', defaultMessage: 'Video' })
        : intl.formatMessage({ id: 'file', defaultMessage: 'File' });

    const limit = fileType === 'Image'
      ? options?.maxFileSize || process.env.NEXT_PUBLIC_MAX_SIZE_IMAGE || 5
      : fileType === 'Video'
        ? options?.maxFileSize || process.env.NEXT_PUBLIC_MAX_SIZE_VIDEO || 5000
        : options?.maxFileSize || process.env.NEXT_PUBLIC_MAX_SIZE_FILE || 1000;

    const isLt5M = file.size / 1024 / 1024 < limit;
    if (!isLt5M) {
      showError(
        intl.formatMessage(
          {
            id: 'targetToLarge',
            defaultMessage: `${fileType} is too large please provide a file {size}MB or below`
          },
          { type: fileType, size: options?.maxFileSize || process.env.NEXT_PUBLIC_MAX_SIZE_IMAGE || 5 }
        )
      );
      return false;
    }
    files.forEach((f: any) => {
      if (!f.url) {
        const updatedFile = { ...f, url: getImageURL(f) };
        setSelectedItems((prev) => [...prev, updatedFile]);
        setUploadFiles((prev) => [...prev, updatedFile]);
      }
    });
    setSelectedItems(files);
    setUploadFiles(files);
    return true;
  };

  const handelOpenModal = () => {
    const continueRunning = onOpenModal ? onOpenModal() : true;
    continueRunning && setOpenModal(true);
  };

  const uploadProps = {
    accept,
    name: options?.fieldName || 'file',
    listType: 'picture-card',
    showUploadList: { showPreviewIcon: false, showRemoveIcon: false, showDownloadIcon: false },
    fileList: uploadFiles,
    action,
    beforeUpload: beforeUpload.bind(this),
    headers: {
      authorization: authService.getToken()
    },
    multiple,
    disabled
  } as any;

  if (!action) {
    uploadProps.customRequest = () => false;
  }

  return (
    <>
      <div aria-hidden onClick={() => !disabled && handelOpenModal()}>
        <span>{btnLabel}</span>
      </div>
      {openModal && (
        <Modal
          title={null}
          open={openModal}
          onOk={handleSubmit}
          onCancel={handleCancel}
          width={990}
          destroyOnClose
        >
          <div>
            <Upload className={styles['vault-upload']} {...uploadProps}>
              <span>{loading ? <AiOutlineLoading /> : <AiOutlineCamera />}</span>
            </Upload>
          </div>
          {!noVault && (
            <>
              <Divider style={{ color: '#fff' }}>
                <span>
                  {intl.formatMessage({
                    id: 'uploadNewOrSelectFromVault',
                    defaultMessage: 'Upload new or select from the gallery below'
                  })}
                </span>
              </Divider>
              {vaults.length > 0 && (
                <div className={styles['vault-grid-items']}>
                  {vaults.map((item: IVault) => (
                    <div
                      key={item?._id}
                      className={styles['item-vault']}
                      aria-hidden
                      onClick={() => handleSelect(item)}
                    >
                      <img
                        src={
                          item?.type === 'photo'
                            ? item.fileUrl
                            : item?.thumbnails && item?.thumbnails[0]
                        }
                        alt="img"
                        className={styles['item-vault-image']}
                      />
                      {item?.type === 'video' && (
                        <span className={styles['play-icon']}>
                          <AiOutlinePlayCircle />
                        </span>
                      )}
                      <Checkbox
                        className={styles['item-vault-checkbox']}
                        checked={!!selectedItems.find((i) => `${i._id}` === `${item.fileId}`)}
                      />
                    </div>
                  ))}
                </div>
              )}
              {!loading && !pagination.total && <Empty />}
              {pagination.total > pagination.pageSize && (
                <Pagination
                  current={pagination.current}
                  pageSize={pagination.pageSize}
                  total={pagination.total}
                  onChange={handlePageChange}
                />
              )}
            </>
          )}
        </Modal>
      )}
    </>
  );
}

UploadFilesModal.defaultProps = {
  action: null,
  accept: 'image/*',
  multiple: false,
  vaultType: '',
  btnLabel: 'Upload',
  options: {},
  disabled: false,
  vaultExisted: null,
  needDefaultOpen: false,
  reset: 0,
  onOpenModal: () => true,
  onCloseModal: () => {},
  uploadFileRef: [],
  noVault: false,
  setMediaType: () => {},
  setOpenUpload: () => {}
};

export default UploadFilesModal;
