import { IFeed } from '@interfaces/feed';
import dynamic from 'next/dynamic';
import React from 'react';

const ViewMediaPopupContainer = dynamic(() => import('src/providers/view-media-popup/provider'));
const FeedContent = dynamic(() => import('@components/feed/cards/card-container/post-slider'));
const VideoContent = dynamic(() => import('@components/video/details/video-player'));
const ProductContent = dynamic(() => import('@components/product/details/product-content'));

interface IProps {
  feed: IFeed;
}
function ContentMiddle({ feed }: IProps) {
  switch (feed.type) {
    case 'video':
      return (
        <VideoContent
          video={{ ...feed, isBought: true, isSubscribed: true } as any}
        />
      );
    case 'reel':
      return (
        <VideoContent
          video={{ ...feed, isBought: true, isSubscribed: true } as any}
        />
      );
    case 'product':
      return (
        <ProductContent product={feed} />
      );
    default:
      return (
        <ViewMediaPopupContainer>
          <FeedContent feed={feed} />
        </ViewMediaPopupContainer>
      );
  }
}

export default ContentMiddle;
