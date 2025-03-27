/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { performerService } from '@services/performer.service';
import { IPerformer } from '@interfaces/performer';
import { Button } from 'antd';
import { useIntl } from 'react-intl';

const UploadFilesModal = dynamic(() => import('@components/vault/upload-files-modal'), { ssr: false });

interface IProps {
  image: string;
  onUploaded: Function;
  performer: IPerformer;
}

export function CoverUpload({
  image, onUploaded, performer
}: IProps) {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(image || '/default-banner.jpg');
  const intl = useIntl();
  const beforeUpload = async (_files) => {
    const file = _files && _files[0];
    if (!file) return;
    if (file._id) {
      await performerService.updateMe(performer._id, { ...performer, coverId: file._id, coverPath: file.path });
      onUploaded(file);
      return;
    }
    setLoading(true);
    const resp = await performerService.uploadAvatar(file, {}, (r) => { }) as any;
    onUploaded(resp.data);
    setLoading(false);
  };

  useEffect(() => {
    image && setImageUrl(image);
  }, [image]);

  return (
    <UploadFilesModal
      key="upload-thumb"
      btnLabel={(
        <Button className="cover-grp">
          {intl.formatMessage({ id: 'editCover', defaultMessage: 'Edit Cover' })}
        </Button>
      )}
      multiple={false}
      disabled={loading}
      vaultType="photo"
      onSubmit={beforeUpload}
    />
  );
}

export default CoverUpload;
