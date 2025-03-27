export interface INotification {
  _id: string,
  userId: string;
  username: string;
  title: string;
  type: string;
  action: string,
  message: string;
  refSource: string;
  refId: string;
  thumbnail: string;
  createdAt: Date;
  updatedAt: Date;
  read: boolean;
}
