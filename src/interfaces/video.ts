import { IPerformer } from './performer';

export interface IVideo {
  _id: string;
  title: string;
  slug: string;
  performerId: string;
  isSale: boolean;
  isFree: boolean;
  isSub: boolean;
  price: number;
  status: string;
  processing: boolean;
  description: string;
  thumbnail: {
    url: string;
    thumbnails: any[]
  };
  teaser: {
    url: string;
    thumbnails: any[]
  };
  teaserProcessing: boolean;
  tags: string[];
  participantIds: string[];
  participants: IPerformer[];
  video: {
    _id: string;
    url: string;
    thumbnails: string[];
    duration: number;
    width: number;
    height: number;
  };
  stats: {
    views: number;
    likes: number;
    comments: number;
    bookmarks: number;
  };
  performer: IPerformer;
  isBought: boolean;
  isSubscribed: boolean;
  isBookmarked: boolean;
  isLiked: boolean;
  isSchedule: boolean;
  scheduledAt: Date;
  updatedAt: Date;
  createdAt: Date;
  teaserId: string;
  fileId: string;
  thumbnailId: string;
  mediaType?: string;
  mediaInfo?: any
  performerInfo?: any;
  isAd?: boolean;
  files?: any
}
