import { Request } from 'express';
export interface UserMetaData {
  userId: string;
  email: string;
  isRootUser: boolean;
  permissions: string[];
  authorization?: string;
}
export interface RequestModel extends Request {
  user: UserMetaData;
}
