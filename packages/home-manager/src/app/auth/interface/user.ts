import { Request } from 'express';
export interface UserMetaData {
  user_id: string;
  organization_id: string;
  root: boolean;
  admin: boolean;
  roles: string[];
}
export interface RequestModel extends Request {
  user: UserMetaData;
}
