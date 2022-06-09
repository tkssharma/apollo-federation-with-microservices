import { BadRequestException, Injectable } from '@nestjs/common';
import { INVALID_AUTH_PROVIDER } from '../../app/shared/constants/app.constants';
import { ConfigService } from '../../config/config.service';
import { AuthFactory } from '../factory/auth.factory';
import { UserMetaData } from '../interface/user';
import Auth0Service from './auth0.service';

@Injectable()
export default class AuthService {
  private authFactory: AuthFactory;

  constructor(
    private config: ConfigService,
    private auth0Service: Auth0Service,
  ) {
    this.authFactory = new AuthFactory([auth0Service]);
  }
  public async init(token: string): Promise<UserMetaData> {
    const authProvider = this.config.get().auth.authProvider;
    const service = this.authFactory.getAuthProvider(authProvider);
    if (!service) {
      throw new BadRequestException(`${INVALID_AUTH_PROVIDER}: ${authProvider}`);
    }
    return await service.authenticate(token);
  }
}
