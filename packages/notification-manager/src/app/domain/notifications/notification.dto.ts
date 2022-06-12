import { ApiProperty } from "@nestjs/swagger";
import {
  IsDefined,
  IsEnum,
  IsOptional, IsUUID
} from 'class-validator';

export enum TemplateType {
  'USER_PASSWORD_RESET_NOTIFICATION' = 'USER_PASSWORD_RESET_NOTIFICATION',
  'USER_SIGNUP_NOTIFICATION' = 'USER_SIGNUP_NOTIFICATION',
  'HOME_CREATED_NOTIFICATION' = 'HOME_CREATED_NOTIFICATION'
}
export class NotificationPayload {

  @ApiProperty({
    description: 'external_id as reference ID (Home Id or User Id)',
    required: false,
    example: '0b16c228-a376-11ec-b909-0242ac120002'
  })
  @IsOptional()
  @IsUUID()
  public external_id?: string;

  @ApiProperty({
    description: 'receiver_email as email of receiver entity',
    required: true,
    example: 'testing@gmail.com'
  })
  @IsDefined()
  public recipient_email?: string;

  @ApiProperty({
    description: 'receiver_email as email of receiver',
    required: false,
    example: 'testing'
  })
  @IsOptional()
  public recipient_name?: string;

  @ApiProperty({
    description: 'template data to be send in email template',
    required: false,
    example: {
      recipient_name: 'okay',
      recipient_email: 'okay@gmail.com'
    }
  })
  @IsDefined()
  public template_data?: any;


  @ApiProperty({
    description: 'type of email template like Invite, welcome invite, promotions etc',
    required: true,
    enum: TemplateType,
    example: 'USER_SIGNUP_NOTIFICATION'
  })
  @IsEnum(TemplateType)
  public template_type?: TemplateType;

}

export class NotificationFilterDtoParam {
  @ApiProperty({
    description: 'sender_id as purchaser_id of Organization',
    required: false,
    example: '0b16c228-a376-11ec-b909-0242ac120002'
  })
  @IsOptional()
  @IsUUID()
  public sender_id?: string;

  @ApiProperty({
    description: 'external_id as project_id',
    required: false,
    example: '0b16c228-a376-11ec-b909-0242ac120002'
  })
  @IsOptional()
  @IsUUID()
  public external_id?: string;

  @ApiProperty({
    description: 'receiver_email as email of receiver entity (supplier or any purchaser)',
    required: false,
    example: 'testing@gmail.com'
  })
  @IsOptional()
  public recipient_email?: string;

  @ApiProperty({
    description: 'receiver_email as email of receiver entity (supplier or any purchaser)',
    required: false,
    example: 'testing'
  })
  @IsOptional()
  public recipient_name?: string;

  @ApiProperty({
    description: 'fetch all emails sent for a template',
    required: false,
    example: 'd-da4a7b3c3b1f4f19b5e2f9949a52dbf9'
  })
  @IsOptional()
  public template_id?: string;


  @ApiProperty({
    description: 'fetch list based on type like RFX_INVITES, RFX_DUE_DATE_CHANGE',
    required: false,
    example: 'email'
  })
  @IsOptional()
  public type?: string;
}