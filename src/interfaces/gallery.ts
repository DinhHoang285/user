import { IPerformer } from './performer';

export interface IGallery {
  _id: string;
  title: string;
  slug: string;
  description: string;
  isSale: boolean;
  status: string;
  price: number;
  performerId: string;
  performer: IPerformer;
  coverPhoto: { thumbnails: string[]; url: string; blurThumbnail: string };
  isBookMarked: boolean;
  isSubscribed: boolean;
  isBought: boolean;
  numOfItems: number;
  stats: {
    views: number;
  }
  createdAt: Date;
  updatedAt: Date;
  objectInfo: any;
  isBookmarked: boolean;
}
