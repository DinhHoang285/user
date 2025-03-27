import { IPerformer } from '.';

export interface IStream {
  _id: string;
  title: string;
  description: string;
  performerId: string;
  performerInfo: IPerformer;
  type: 'public' | 'group' | 'private';
  sessionId: string;
  isStreaming: number;
  streamingTime: number;
  lastStreamingTime: Date;
  isFree: boolean;
  price: number;
  stats: {
    members: number;
    likes: number;
  };
  isSubscribed: boolean;
  createdAt: Date;
  updatedAt: Date;
  conversationId: string;
  hasPurchased: boolean;
  isPublic: boolean;
}
