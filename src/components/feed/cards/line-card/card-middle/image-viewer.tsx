'use client';

import ImageWithFallback from '@components/common/images/image-fallback';
import { IFile } from '@interfaces/file';
import { useViewPopup } from 'src/providers/view-media-popup/context';

type IProps = {
  priority: boolean;
  file: IFile;
  files: IFile[];
};

export default function PostImage({ priority, file, files }: IProps) {
  const { showPopup } = useViewPopup();
  return (
    <ImageWithFallback
      options={{
        unoptimized: true,
        quality: 80,
        width: file.width || 650,
        height: file.height || 650,
        priority,
        className: 'img-viewer',
        sizes: '(max-width: 768px) 70vw, (max-width: 2100px) 40vw',
        onClick: () => showPopup({ content: files, index: 0 })
      }}
      alt="post-photo"
      src={file.url}
    />
  );
}
