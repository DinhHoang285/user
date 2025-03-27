/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { performerService } from '@services/performer.service';
import { IPerformer } from '@interfaces/performer';
import Image from 'next/image';

const UploadFilesModal = dynamic(() => import('@components/vault/upload-files-modal'), { ssr: false });

interface IProps {
  image: string;
  onUploaded: Function;
  performer: IPerformer;
}

export function AvatarUpload({
  image, onUploaded, performer
}: IProps) {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(image || '/no-avatar.png');

  const beforeUpload = async (_files) => {
    const file = _files && _files[0];
    if (!file) return;
    if (file._id) {
      await performerService.updateMe(performer._id, { ...performer, avatarId: file._id, avatarPath: file.path });
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
        <div className="avatar-grp">
          <Image width={94} height={94} unoptimized src={imageUrl} alt="avatar" />
        </div>
      )}
      multiple={false}
      disabled={loading}
      vaultType="photo"
      onSubmit={beforeUpload}
    />
  );
}

export default AvatarUpload;
