import { ApiProperty } from "@nestjs/swagger";
import {
  IsDefined,
  IsOptional, IsUUID
} from 'class-validator';

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
    example: {}
  })
  @IsDefined()
  public template_data?: object;


  @ApiProperty({
    description: 'type of email template like Invite, welcome invite, promotions etc',
    required: true,
    example: 'Signup email notification'
  })
  @IsDefined()
  public template_type?: string;

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