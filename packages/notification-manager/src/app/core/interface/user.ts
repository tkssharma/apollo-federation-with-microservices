import { Request } from 'express';
import { UserMetaData } from '@auth/interface/user';

export interface RequestModel extends Request {
  user: UserMetaData;
}
