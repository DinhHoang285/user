import ImageWithFallback from '@components/common/images/image-fallback';
import { IAdvertisement } from 'src/interfaces';

interface IProps {
  video: IAdvertisement;
  style?: any;
}

export function ThumbnailAds({ video: videoProp, style }: IProps) {
  const { thumbnail, video } = videoProp;
  const url = (thumbnail?.thumbnails && thumbnail?.thumbnails[0]) || (video?.thumbnails && video?.thumbnails[0]) || '/no-image.jpg';
  return (
    <ImageWithFallback
      options={{
        width: 50,
        height: 50,
        style: style || { height: 50, width: 'auto' }
      }}
      alt="thumbnail"
      src={url || '/leaf.jpg'}
    />
  );
}
