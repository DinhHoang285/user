/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AiOutlineCamera, AiOutlineLoading, AiOutlinePlayCircle } from 'react-icons/ai';
import {
  Checkbox, Divider, Empty, Form,
  Pagination, Upload
} from 'antd';
import { uniqBy } from 'lodash';
import { ReactNode, useEffect, useState } from 'react';
import { IVault } from 'src/interfaces';
import { showError } from '@lib/message';
import { authService } from '@services/auth.service';
import { useIntl } from 'react-intl';
import { vaultService } from '../../services/vault.service';
import styles from './vault.module.scss';

interface IProps {
  accept?: string;
  action?: string;
  onSubmit: Function;
  multiple?: boolean;
  vaultType?: string;
  btnLabel?: ReactNode;
  options?: any;
  disabled?: boolean;
}

function UploadFilesModalMenu({
  action, accept, onSubmit, multiple, vaultType, btnLabel, options, disabled
}: IProps) {
  const intl = useIntl();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 12, total: 0 });
  const [vaults, setVaults] = useState<IVault[]>([] as any);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [openModal, setOpenModal] = useState(false);

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
      showError(e?.message || intl.formatMessage({ id: 'somethingWentWrong', defaultMessage: 'Something went wrong, please try again' }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    openModal && getVaults();
  }, [pagination.current, openModal]);

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
          setSelectedItems(uniqBy([...selectedItems, ...[data]], (i) => (i?._id || i?.uid)));
        }
        break;
      default:
    }
  };

  const handleCancel = () => {
    setSelectedItems([]);
    setOpenModal(false);
  };

  const handlePageChange = (page, pageSize) => setPagination({ ...pagination, current: page, pageSize });

  const handleSubmit = () => {
    onSubmit(selectedItems);
    setOpenModal(false);
  };

  const beforeUpload = (file, files) => {
    const config = null;
    const isLt5M = file.size / 1024 / 1024 < (options?.maxFileSize || config.NEXT_PUBLIC_MAX_SIZE_IMAGE || 5);
    if (!isLt5M) {
      const fileType = file.type.includes('image')
        ? intl.formatMessage({ id: 'image', defaultMessage: 'Image' })
        : file.type?.includes('video')
          ? intl.formatMessage({ id: 'video', defaultMessage: 'Video' })
          : intl.formatMessage({ id: 'file', defaultMessage: 'File' });
      showError(intl.formatMessage(
        { id: 'targetToLarge', defaultMessage: `${fileType} is too large please provide a file {size}MB or below` },
        { type: fileType, size: options?.maxFileSize || config.NEXT_PUBLIC_MAX_SIZE_IMAGE || 5 }
      ));
      return false;
    }
    setSelectedItems(files);
    setUploadFiles(files);
    return true;
  };

  const uploadProps = {
    accept,
    name: options.fieldName || 'file',
    listType: 'picture-card',
    showUploadList: { showPreviewIcon: false, showRemoveIcon: false, showDownloadIcon: false },
    fileList: uploadFiles,
    action, // upload url
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
    <Form>
      <div>
        <Upload className={styles['vault-upload']} {...uploadProps}>
          <span>{loading ? <AiOutlineLoading /> : <AiOutlineCamera />}</span>
        </Upload>
      </div>
      <Divider style={{ color: '#fff' }}>
        <span>
          {intl.formatMessage({ id: 'uploadNewOrSelectFromVault', defaultMessage: 'Upload new or select from the gallery below' })}
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
                src={item?.type === 'photo'
                  ? item.fileUrl
                  : (item?.thumbnails && item?.thumbnails[0])}
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
    </Form>
  );
}

UploadFilesModalMenu.defaultProps = {
  action: null,
  accept: 'image/*',
  multiple: false,
  vaultType: '',
  btnLabel: 'Upload',
  options: {},
  disabled: false
};

export default UploadFilesModalMenu;
