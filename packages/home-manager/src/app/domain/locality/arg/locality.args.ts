import { MinLength } from 'class-validator';
import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class GetLocalityArgs {
  @Field({ defaultValue: '' })
  @MinLength(3)
  public city!: string;

  @Field({ defaultValue: '' })
  @MinLength(3)
  public state!: string;

  @Field({ defaultValue: '' })
  @MinLength(3)
  public street!: string;

  @Field({ defaultValue: '' })
  @MinLength(3)
  public zip_code!: string;

  @Field({ defaultValue: '' })
  @MinLength(3)
  public country!: string;

  @Field({ defaultValue: '' })
  @MinLength(3)
  public name!: string;
}