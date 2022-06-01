import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class File {
  @Field(() => String)
  id!: string;

  @Field(() => String)
  user_id!: string;

  @Field(() => String)
  reference_id!: string;

  @Field(() => String)
  name!: string;

  @Field(() => String)
  url!: string;

  @Field(() => String)
  mimetype!: string;

  @Field(() => String)
  storage_unique_name!: string;

  @Field(() => String, { nullable: true })
  banner?: string;

  private _banner?: Buffer;
}
