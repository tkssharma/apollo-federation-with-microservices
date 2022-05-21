import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Context, ResolveReference } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserInput, User, UpdateUserInput } from '../graphql.classes';
import { UsernameEmailAdminGuard } from '../auth/guards/username-email-admin.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { UserInputError, ValidationError } from 'apollo-server-core';
import { AdminAllowedArgs } from '../decorators/admin-allowed-args';
import { UserEntity } from './entity/users.entity';
import { Logger } from 'src/logger/logger';

@Resolver('User')
export class UserResolver {
  constructor(private usersService: UsersService, private readonly logger: Logger) { }

  @Query('users')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async users(): Promise<UserEntity[]> {
    return await this.usersService.getAllUsers();
  }

  @Query('userLogin')
  @UseGuards(JwtAuthGuard, UsernameEmailAdminGuard)
  async userLogin(
    @Args('username') username?: string,
    @Args('email') email?: string,
  ): Promise<UserEntity> {
    let user: UserEntity | null;
    if (username) {
      user = await this.usersService.findOneByUsername(username);
    } else if (email) {
      user = await this.usersService.findOneByEmail(email);
    } else {
      // Is this the best exception for a graphQL error?
      throw new ValidationError('A username or email must be included');
    }

    if (user) return user;
    throw new UserInputError('The user does not exist');
  }

  // A NotFoundException is intentionally not sent so bots can't search for emails
  @Query('forgotPassword')
  async forgotPassword(@Args('email') email: string): Promise<boolean> {
    return await this.usersService.forgotPassword(email);
  }

  // What went wrong is intentionally not sent (wrong username or code or user not in reset status)
  @Mutation('resetPassword')
  async resetPassword(
    @Args('username') username: string,
    @Args('code') code: string,
    @Args('password') password: string,
  ): Promise<UserEntity> {
    const user = await this.usersService.resetPassword(
      username,
      code,
      password,
    );
    if (!user) throw new UserInputError('The password was not reset');
    return user;
  }

  @Mutation('createUser')
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<UserEntity> {
    let createdUser: UserEntity | null;
    try {
      createdUser = await this.usersService.create(createUserInput);
    } catch (error) {
      throw new UserInputError(error.message);
    }
    return createdUser;
  }

  @Mutation('updateUser')
  @AdminAllowedArgs(
    'username',
    'fieldsToUpdate.username',
    'fieldsToUpdate.email',
    'fieldsToUpdate.enabled',
  )
  @UseGuards(JwtAuthGuard, UsernameEmailAdminGuard)
  async updateUser(
    @Args('username') username: string,
    @Args('fieldsToUpdate') fieldsToUpdate: UpdateUserInput,
    @Context('req') request: any,
  ): Promise<UserEntity> {
    let user: UserEntity | undefined;
    if (!username && request.user) username = request.user.username;
    try {
      user = await this.usersService.update(username, fieldsToUpdate);
    } catch (error) {
      throw new ValidationError(error.message);
    }
    if (!user) throw new UserInputError('The user does not exist');
    return user;
  }

  @Mutation('addAdminPermission')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async addAdminPermission(@Args('username') username: string): Promise<UserEntity> {
    const user = await this.usersService.addPermission('admin', username);
    if (!user) throw new UserInputError('The user does not exist');
    return user;
  }

  @Mutation('removeAdminPermission')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async removeAdminPermission(
    @Args('username') username: string,
  ): Promise<UserEntity> {
    const user = await this.usersService.removePermission('admin', username);
    if (!user) throw new UserInputError('The user does not exist');
    return user;
  }

  @ResolveReference()
  async resolveReference(reference: { __typename: string; id: string }) {
    this.logger.http("ResolveReference :: user")
    return await this.usersService.findOneByUserId(reference.id);
  }

  @Query('user')
  @UseGuards(JwtAuthGuard, AdminGuard)
  user(@Args('id') id: string) {
    return this.usersService.findOneByUserId(id);
  }
}
