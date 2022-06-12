import { IsDefined, isDefined, IsEmail, IsString, MinLength } from "class-validator"

export class UserSignup {
  @IsDefined()
  @IsString()
  @IsEmail()
  public email!: string;

  @IsDefined()
  @IsString()
  public first_name!: string;

  @IsDefined()
  @IsString()
  public last_name!: string;


  @IsDefined()
  @MinLength(6)
  @IsString()
  public password!: string;
}