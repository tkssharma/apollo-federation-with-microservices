import { Injectable } from '@nestjs/common';
import { CreateUserInput, FindUserInput, UpdateUserInput } from '../graphql.classes';
import { randomBytes } from 'crypto';
import { createTransport, SendMailOptions } from 'nodemailer';
import { ConfigService } from '../config/config.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { AuthService } from '../auth/auth.service';
import { UserEntity } from './entity/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Logger } from '../logger/logger';

export interface UserAuthorization {
  authorization: string;
}

@Injectable()
export class UsersService {
  constructor(
    private readonly logger: Logger,
    private eventEmitter: EventEmitter2,
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>, private configService: ConfigService,
    private authService: AuthService,
  ) { }

  /**
   * Returns if the user has 'admin' set on the permissions array
   *
   * @param {string[]} permissions permissions property on a User
   * @returns {boolean}
   * @memberof UsersService
   */
  isAdmin(permissions: string[]): boolean {
    return permissions.includes('admin');
  }

  /**
   * Adds any permission string to the user's permissions array property. Checks if that value exists
   * before adding it.
   *
   * @param {string} permission The permission to add to the user
   * @param {string} email The user's username
   * @returns {(Promise<UserEntity | undefined>)} The user Document with the updated permission. Undefined if the
   * user does not exist
   * @memberof UsersService
   */
  async addPermission(
    permission: string,
    email: string,
  ): Promise<UserEntity | undefined> {
    const user = await this.findOneByEmail(email);
    if (!user) return null;
    if (user.permissions.includes(permission)) return user;
    user.permissions.push(permission);
    await user.save();
    return user;
  }

  /**
   * Removes any permission string from the user's permissions array property.
   *
   * @param {string} permission The permission to remove from the user
   * @param {string} email The email of the user to remove the permission from
   * @returns {(Promise<UserEntity | undefined>)} Returns undefined if the user does not exist
   * @memberof UsersService
   */
  async removePermission(
    permission: string,
    email: string,
  ): Promise<UserEntity | undefined> {
    const user = await this.findOneByEmail(email);
    if (!user) return undefined;
    user.permissions = user.permissions.filter(
      userPermission => userPermission !== permission,
    );
    await user.save();
    return user;
  }

  /**
 * Updates a user in the database. If any value is invalid, it will still update the other
 * fields of the user.
 *
 * @param {string} email of the user to update
 * @param {UpdateUserInput} fieldsToUpdate The user can update their email, password, or enabled. If
 * the email is updated, the user's token will no longer work. If the user disables their account, only an admin
 * can reenable it
 * @returns {(Promise<UserEntity | undefined>)} Returns undefined if the user cannot be found
 * @memberof UsersService
 */
  async updateById(
    id: string,
    fieldsToUpdate: UpdateUserInput,
  ): Promise<UserEntity | undefined> {

    if (fieldsToUpdate.email) {
      const duplicateUser = await this.findOneByEmail(fieldsToUpdate.email);
      if (duplicateUser)
        fieldsToUpdate.email = undefined;
    }

    const fields: any = {};

    if (fieldsToUpdate.password) {
      if (
        await this.authService.validateUserById({
          id,
          password: fieldsToUpdate.password.oldPassword,
        })
      ) {
        fields.password = fieldsToUpdate.password.newPassword;
      }
    }

    // Remove undefined keys for update
    for (const key in fieldsToUpdate) {
      if (typeof fieldsToUpdate[key] !== 'undefined' && key !== 'password') {
        fields[key] = fieldsToUpdate[key];
      }
    }

    let user: UserEntity | undefined | null = null;

    if (Object.entries(fieldsToUpdate).length > 0) {
      user = await this.findOneByUserId(id);
      if (fields.email) {
        fields.lowercaseEmail = fields.email.toLowerCase();
      }
      const saveEntity = { ...user, ...fields };
      await this.userRepo.save(saveEntity)
    }
    user = await this.findOneByUserId(id);
    if (!user) return null;

    return user;
  }

  /**
   * Updates a user in the database. If any value is invalid, it will still update the other
   * fields of the user.
   *
   * @param {string} email of the user to update
   * @param {UpdateUserInput} fieldsToUpdate The user can update their email, password, or enabled. If
   * the email is updated, the user's token will no longer work. If the user disables their account, only an admin
   * can reenable it
   * @returns {(Promise<UserEntity | undefined>)} Returns undefined if the user cannot be found
   * @memberof UsersService
   */
  async update(
    email: string,
    fieldsToUpdate: UpdateUserInput,
  ): Promise<UserEntity | undefined> {

    if (fieldsToUpdate.email) {
      const duplicateUser = await this.findOneByEmail(fieldsToUpdate.email);
      if (duplicateUser)
        fieldsToUpdate.email = undefined;
    }

    const fields: any = {};

    if (fieldsToUpdate.password) {
      if (
        await this.authService.validateUserByPassword({
          email,
          password: fieldsToUpdate.password.oldPassword,
        })
      ) {
        fields.password = fieldsToUpdate.password.newPassword;
      }
    }

    // Remove undefined keys for update
    for (const key in fieldsToUpdate) {
      if (typeof fieldsToUpdate[key] !== 'undefined' && key !== 'password') {
        fields[key] = fieldsToUpdate[key];
      }
    }

    let user: UserEntity | undefined | null = null;

    if (Object.entries(fieldsToUpdate).length > 0) {
      user = await this.findOneByEmail(email.toLowerCase());
      if (fields.email) {
        fields.lowercaseEmail = fields.email.toLowerCase();
      }
      const saveEntity = { ...user, ...fields };
      await this.userRepo.save(saveEntity)
    }
    user = await this.findOneByEmail(email);
    if (!user) return null;

    return user;
  }

  /**
   * Send an email with a password reset code and sets the reset token and expiration on the user.
   * EMAIL_ENABLED must be true for this to run.
   *
   * @param {string} email address associated with an account to reset
   * @returns {Promise<boolean>} if an email was sent or not
   * @memberof UsersService
   */
  async forgotPassword(email: string, userMeta: UserAuthorization): Promise<boolean> {

    const user = await this.findOneByEmail(email);
    if (!user) return false;

    const token = randomBytes(32).toString('hex');

    // One day for expiration of reset token
    const expiration = new Date(Date().valueOf() + 24 * 60 * 60 * 1000);

    return new Promise(resolve => {
      this.eventEmitter.emit('USER_PASSWORD_RESET_NOTIFICATION', {
        user,
        token,
        authorization: userMeta.authorization
      });
      user.passwordReset = {
        token,
        expiration,
      };
      user.updated_at = new Date();

      user.save().then(
        () => resolve(true),
        () => resolve(false),
      );
    });
  }

  /**
   * Resets a password after the user forgot their password and requested a reset
   *
   * @param {string} email
   * @param {string} code the token set when the password reset email was sent out
   * @param {string} password the new password the user wants
   * @returns {(Promise<UserEntity | undefined>)} Returns undefined if the code or the username is wrong
   * @memberof UsersService
   */
  async resetPassword(
    email: string,
    code: string,
    password: string,
  ): Promise<UserEntity | undefined> {
    const user = await this.findOneByEmail(email);
    if (user && user.passwordReset) {
      if (user.passwordReset.token === code) {
        user.password = await this.hashPassword(password);
        user.passwordReset = null;
        await user.save();
        return user;
      }
    }
    return null;
  }

  /**
   * Creates a user
   *
   * @param {CreateUserInput} createUserInput username, email, and password. Username and email must be
   * unique, will throw an email with a description if either are duplicates
   * @returns {Promise<UserEntity>} or throws an error
   * @memberof UsersService
   */
  async create(createUserInput: CreateUserInput, userMeta: UserAuthorization): Promise<UserEntity> {
    const userEntity = this.userRepo.create();
    const pass = await this.hashPassword(createUserInput.password);

    const saveEntity = {
      ...userEntity,
      ...createUserInput,
      password: pass,
      first_name: createUserInput?.first_name?.toLowerCase(),
      last_name: createUserInput?.last_name?.toLowerCase(),
      lowercaseEmail: createUserInput.email.toLowerCase()
    };

    let user: UserEntity | null;
    try {
      user = await this.userRepo.save(saveEntity);
      this.eventEmitter.emit('USER_SIGNUP_NOTIFICATION', {
        user,
        authorization: userMeta.authorization
      });
      this.logger.log(`sending event USER_SIGNUP_NOTIFICATION`)
    } catch (error) {
      console.log(error)
      throw this.evaluateDBError(error, createUserInput);
    }
    return user;
  }

  private async hashPassword(password) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }
  private async comparePassword(enteredPassword, dbPassword) {
    const match = await bcrypt.compare(enteredPassword, dbPassword);
    return match;
  }

  /**
   * Returns a user by their unique email address or undefined
   *
   * @param {string} email address of user, not case sensitive
   * @returns {(Promise<UserEntity | undefined>)}
   * @memberof UsersService
   */
  async findOneByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.userRepo
      .findOne({ where: { lowercaseEmail: email.toLowerCase() } })
    if (user) return user;
    return null;
  }

  /**
 * Returns a user by their unique email address or undefined
 *
 * @param {userId} string user ruuid
 * @returns {(Promise<UserEntity | undefined>)}
 * @memberof UsersService
 */
  async findOneByUserId(id: string): Promise<UserEntity | null> {
    const user = await this.userRepo
      .findOne({ where: { id } })
    console.log(user);
    if (user) return user;
    return null;
  }


  /**
   * Gets all the users that are registered
   *
   * @returns {Promise<UserEntity[]>}
   * @memberof UsersService
   */
  async getAllUsers(): Promise<UserEntity[]> {
    const users = await this.userRepo.find({});
    return users;
  }


  /**
 * Gets all the users that are registered with search
 *
 * @returns {Promise<UserEntity[]>}
 * @memberof UsersService
 */
  async findUsers(input: FindUserInput): Promise<UserEntity[]> {
    console.log(input)
    const { name, email, first_name, last_name } = input
    const users = await this.userRepo.find({
      where: [
        { name: Like(`%${name}%`) },
        { email: Like(`%${email}%`) },
        { first_name: Like(`%${first_name}%`) },
        { last_name: Like(`%${last_name}%`) },
      ]
    });
    return users;
  }

  /**
   * Deletes all the users in the database, used for testing
   *
   * @returns {Promise<void>}
   * @memberof UsersService
   */
  async deleteAllUsers(): Promise<void> {
    // await this.userModel.deleteMany({});
    return null;
  }

  /**
   * Reads a mongo database error and attempts to provide a better error message. If
   * it is unable to produce a better error message, returns the original error message.
   *
   * @private
   * @param {MongoError} error
   * @param {CreateUserInput} createUserInput
   * @returns {Error}
   * @memberof UsersService
   */
  private evaluateDBError(
    error: Error,
    createUserInput: CreateUserInput,
  ): Error {
    throw new Error(
      `Username ${createUserInput.email} is already registered`,
    );
  }
}
