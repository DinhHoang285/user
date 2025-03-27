'use client';

import { IFeed } from '@interfaces/feed';
import dynamic from 'next/dynamic';
import { isMediaType } from '@lib/file';
import { getThumbnail } from '@lib/utils';
import { useViewPopup } from 'src/providers/view-media-popup/context';
import ViewMediaPopupContainer from 'src/providers/view-media-popup/provider';

import style from './post-slider.module.scss';

const ImageWithFallback = dynamic(() => import('@components/common/images/image-fallback'));
const HtmlVideolayer = dynamic(() => import('@components/video/player/html-player'));
const AudioPlayer = dynamic(() => import('@components/video/player/audio-player'));
const PhotoPreviewList = dynamic(() => import('@components/photo/photo-preview-list'));

interface IProps {
  feed: IFeed;
}

export default function FeedSlider({ feed }: IProps) {
  const thumbUrl = getThumbnail(feed);
  const { showPopup } = useViewPopup();

  if (!feed?.files || !feed.files.length) return null;
  // eslint-disable-next-line no-param-reassign
  if (((feed as any).isAd) && (!feed.files || feed?.fileIds?.length)) { feed.files = [{ ...feed.thumbnail, type: 'image' }]; }

  return (
    <div className={style['feed-slider']}>
      {feed.files.length === 1 && (feed?.files || []).map((file, index) => {
        if (isMediaType(file, 'image')) {
          return (
            <ImageWithFallback
              key={file._id}
              options={{
                unoptimized: true,
                quality: 90,
                width: 1080,
                height: 1080,
                sizes: '(max-width: 768px) 50vw, (max-width: 2100px) 30vw'
              }}
              alt="post-photo"
              fallbackSrc="/no-image.jpg"
              src={file?.url || '/no-image.jpg'}
              onClick={() => {
                showPopup({ content: feed.files, index });
              }}
            />
          );
        }
        if (feed.type === 'audio') {
          return (
            <AudioPlayer
              key={file._id}
              url={file.url}
              thumbnailUrl={thumbUrl || '/audio-playing.webp'}
            />
          );
        }

        return (
          <HtmlVideolayer
            key={file._id}
            videoSrc={file.url}
            videoId={feed._id}
            thumbUrl={file.thumbnails && file.thumbnails[0]}
            priority={false}
            aspectRatio={file.width && file.height ? file.width / file.height : ''}
            classes="in-feed"
          />
        );
      })}
      {feed.files && feed.files.length > 1 && (
        <ViewMediaPopupContainer>
          <PhotoPreviewList
            defaultPhotos={feed.files}
            gallery={feed}
          />
        </ViewMediaPopupContainer>
      )}
    </div>
  );
}
