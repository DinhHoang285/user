'use client';

import dynamic from 'next/dynamic';
import { IFeed } from '@interfaces/feed';
import AudioPlayer from '@components/video/player/audio-player';
import PhotoPreviewList from '@components/photo/photo-preview-list';
import PostImage from './image-viewer';
import ProductViewer from './product-viewer';

const HtmlVideolayer = dynamic(() => import('@components/video/player/html-player'));

interface IProps {
  feed: IFeed;
  priority?: boolean;
}

export default function PostMediaViewer({ feed, priority = false }: IProps) {
  const file = feed.files[0];

  return (
    <div className="feed-content">
      {feed?.files?.length > 1 && (
        <PhotoPreviewList
          isBlur={false}
          defaultPhotos={feed.files}
        />
      )}
      {/* eslint-disable-next-line no-nested-ternary */}
      {(feed?.files?.length === 1 && file.type.includes('photo') && feed.type === 'photo') ? (
        <PostImage
          priority={priority}
          files={feed.files}
          file={feed.files[0]}
        />
        // eslint-disable-next-line no-nested-ternary
      ) : (file.type.includes('audio') && feed.type === 'audio') ? (
        <AudioPlayer
          url={feed.files[0].url}
          thumbnailUrl={feed.thumbnail.thumbnails[0]}
        />
      ) : (file.type.includes('photo') && feed.type === 'product') ? (
        <ProductViewer product={feed} />
      ) : ['video', 'reel'].includes(feed.type) && (
        <HtmlVideolayer
          key={file._id}
          classes="f-vid-player"
          videoSrc={file.url}
          videoId={file._id}
          thumbUrl={file.thumbnails && file.thumbnails[0]}
          priority={priority}
          aspectRatio={file.width && file.height ? file.width / file.height : 'unset'}
        />
      )}
    </div>
  );
}
