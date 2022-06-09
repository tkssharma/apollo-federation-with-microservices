import { UserMetaData } from '@auth/interface/user';
import { AuthServiceInterface } from '../auth.service.interface';

export interface Auth0ServiceInterface extends AuthServiceInterface {
  authenticate(token: string): Promise<UserMetaData>;
}
