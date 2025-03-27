export interface IVault {
  _id: string;

  fromSourceId: string;

  fromSource: string;

  target: string;

  targetId: string;

  fileId: string;

  type: string;

  fileUrl: string;

  size: number;

  name: string;

  thumbnails: string[];

  createAt: Date;

  updatedAt: Date;
}
