export interface JwtPayload {
  userId: string;
  email: string;
  permissions: string[]
  expiration?: Date;
}
