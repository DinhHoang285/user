import { IFeed } from '@interfaces/feed';

export function formatTimeAgo(isoString) {
  const timeInMilliseconds = new Date(isoString).getTime();
  const seconds = Math.floor((Date.now() - timeInMilliseconds) / 1000);

  if (seconds < 60) {
    return `${seconds} seconds ago`;
  } if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} minutes ago`;
  } if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return `${hours} hours ago`;
  }
  const days = Math.floor(seconds / 86400);
  return `${days} days ago`;
}

export function formatViews(views) {
  if (views >= 1000 && views < 1000000) {
    return `${(views / 1000).toFixed(1)}k`;
  } if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`;
  }
  return `${views}`;
}

export function getCanView(media: IFeed, isBought: Boolean): boolean {
  if (
    media?.isFree
    || (media?.isSub && media.isSubscribed) // for subscriber
    || (media?.isSale && isBought)
    || media?.mediaType === 'product'
    || media?.type === 'text'
    || media?.isAd
  ) {
    return true;
  }

  return false;
}
