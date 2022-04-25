import { UserMetaData } from '../interface/user';
import { AuthProvider } from './authprovider';

export interface AuthServiceInterface {
  getAuthProvider(): AuthProvider;
  authenticate(token: string, origin?: string): Promise<UserMetaData>;
}
