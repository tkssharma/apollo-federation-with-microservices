import { Resolver, Args, Query, Context } from '@nestjs/graphql';
import { LoginUserInput, LoginResult } from '../graphql.classes';
import { AuthService } from './auth.service';
import { AuthenticationError } from 'apollo-server-core';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { UserDocument } from '../users/schemas/user.schema';
import { Logger } from "../logger";

@Resolver('Auth')
export class AuthResolver {
  private readonly logger = new Logger("AuthResolver");
  constructor(private authService: AuthService) { }

  @Query('login')
  async login(@Args('user') user: LoginUserInput): Promise<LoginResult> {
    try {
      const result = await this.authService.validateUserByPassword(user);
      const tag = "[auth-login]";
      this.logger.verbose(`${tag} input: %j`, { result });
      this.logger.log(`${tag} input: %j`, { result });
      this.logger.debug(`${tag} input: %j`, { result });
      this.logger.verbose(`${tag} input: %j`, { result });

      if (result) return result;
      throw new AuthenticationError(
        'Could not log-in with the provided credentials',
      );
    }
    catch (err) {
      throw err;
    }
  }

  // There is no username guard here because if the person has the token, they can be any user
  @Query('refreshToken')
  @UseGuards(JwtAuthGuard)
  async refreshToken(@Context('req') request: any): Promise<string> {
    const user: UserDocument = request.user;
    if (!user)
      throw new AuthenticationError(
        'Could not log-in with the provided credentials',
      );
    const result = await this.authService.createJwt(user);
    if (result) return result.token;
    throw new AuthenticationError(
      'Could not log-in with the provided credentials',
    );
  }
}
