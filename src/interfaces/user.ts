export interface IUser {
  [x: string]: any
  _id: string;
  avatar: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  username: string;
  roles: string[];
  isPerformer: boolean;
  isOnline: number;
  verifiedEmail: boolean;
  verifiedAccount: boolean;
  twitterConnected: boolean;
  googleConnected: boolean;
  cover: string;
  dateOfBirth: Date;
  balance: number;
  stats: any;
  enable2StepEmail: boolean;
  unreadMessage: number;
  unreadNotification: number;
}
