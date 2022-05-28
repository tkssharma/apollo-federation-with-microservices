
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export class LoginUserInput {
    email: string;
    password: string;
}

export class CreateUserInput {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    name?: Nullable<string>;
    picture_url?: Nullable<string>;
}

export class UpdateUserInput {
    password?: Nullable<UpdatePasswordInput>;
    enabled?: Nullable<boolean>;
    name?: Nullable<string>;
    email?: Nullable<string>;
    first_name?: Nullable<string>;
    last_name?: Nullable<string>;
    picture_url?: Nullable<string>;
}

export class FindUserInput {
    name?: Nullable<string>;
    email?: Nullable<string>;
    first_name?: Nullable<string>;
    last_name?: Nullable<string>;
}

export class UpdatePasswordInput {
    oldPassword: string;
    newPassword: string;
}

export abstract class IQuery {
    abstract login(user: LoginUserInput): LoginResult | Promise<LoginResult>;

    abstract refreshToken(): string | Promise<string>;

    abstract users(): User[] | Promise<User[]>;

    abstract userById(id: string): User | Promise<User>;

    abstract findUsers(input: FindUserInput): Nullable<User[]> | Promise<Nullable<User[]>>;

    abstract userByEmail(email: string): User | Promise<User>;

    abstract forgotPassword(email?: Nullable<string>): Nullable<boolean> | Promise<Nullable<boolean>>;
}

export class LoginResult {
    user: User;
    token: string;
}

export abstract class IMutation {
    abstract createUser(createUserInput?: Nullable<CreateUserInput>): User | Promise<User>;

    abstract updateUserByEmail(fieldsToUpdate: UpdateUserInput, email?: Nullable<string>): User | Promise<User>;

    abstract updateUserById(fieldsToUpdate: UpdateUserInput, id?: Nullable<string>): User | Promise<User>;

    abstract updateOwnProfile(fieldsToUpdate: UpdateUserInput): User | Promise<User>;

    abstract addAdminPermission(email: string): User | Promise<User>;

    abstract removeAdminPermission(email: string): User | Promise<User>;

    abstract resetPassword(email: string, code: string, password: string): User | Promise<User>;
}

export class User {
    id: string;
    email: string;
    permissions: string[];
    first_name?: Nullable<string>;
    last_name?: Nullable<string>;
    name?: Nullable<string>;
    picture_url?: Nullable<string>;
    created_at: Date;
    updated_at: Date;
}

type Nullable<T> = T | null;
