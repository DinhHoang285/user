import { IUser } from './user';

export interface IAdvertisement {
  _id: string;

  creatorId: string;

  categoryIds: string[];

  fileId: string;

  title: string;

  description: string;

  status: string;

  tags: string[];

  processing: boolean;

  thumbnailId: string;

  thumbnail: any;

  video: any;

  participantIds: string[];

  stats: {
    views: number;
    likes: number;
    comments: number;
  };

  isSchedule: boolean;

  isBookMarked: boolean;

  isLiked: boolean;

  totalLike: boolean;

  scheduledAt: any;

  createdBy: string;

  updatedBy: string;

  createdAt: Date;

  updatedAt: Date;

  creator: IUser;

  ordering: number;

  type: string;

  isAd: boolean;

  redirectLink: string;

  slug: string;
}
