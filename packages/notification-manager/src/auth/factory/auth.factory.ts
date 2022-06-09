import { AuthServiceInterface } from '../interfaces/auth.service.interface';

export class AuthFactory {
  private mapping: { [key: string]: AuthServiceInterface } = {};

  public constructor(services: AuthServiceInterface[]) {
    services.forEach((service: AuthServiceInterface) => {
      this.mapping[service.getAuthProvider()] = service;
    });
  }

  public getAuthProvider(authProvider: string): AuthServiceInterface | undefined {
    return this.mapping[authProvider];
  }
}
