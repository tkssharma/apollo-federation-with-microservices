import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayUnique,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from "class-validator";
import { ContractStatus } from './home.entity';


export class ContractByIdPathParams {
  @ApiProperty({ description: 'the ID of the contract entity', required: true })
  @IsUUID()
  public id!: string;
}
export class BaseParams {

  @ApiProperty({ description: 'description about contract', required: false, example: 'test' })
  @IsOptional()
  @IsString()
  public description?: string;

  @ApiProperty({ description: 'description about contract', required: false, default: false })
  @IsOptional()
  @IsBoolean()
  public is_reminder_set?: boolean;


  @ApiProperty({ description: 'is_alarm_set flag to send alarm', required: false, default: false })
  @IsOptional()
  @IsBoolean()
  public is_alarm_set?: boolean;

  @ApiProperty({ description: 'contract alarm date', required: false, example: '2021-08-05T14:48:00.000Z' })
  @IsOptional()
  @IsDateString()
  public alarm_date?: string;

  @ApiProperty({ description: 'contract state date', required: true, example: '2021-08-05T14:48:00.000Z' })
  @IsDateString()
  public starts_at?: string;

  @ApiProperty({ description: 'contract end date', required: false, example: '2021-10-05T14:48:00.000Z' })
  @IsOptional()
  @IsDateString()
  public ends_at?: string;

  @ApiProperty({ description: 'payment_terms of contract', required: false })
  @IsOptional()
  @IsString()
  public payment_terms?: string;

  @ApiProperty({ description: 'payment_date of contract', required: false, example: '2011-10-05T14:48:00.000Z' })
  @IsOptional()
  @IsDateString()
  public payment_date?: string;

  @ApiProperty({ description: 'amount of contract in cents', required: false, example: 1000 })
  @IsOptional()
  @IsInt()
  public amount?: number;

  @ApiProperty({ description: 'currency of contract', required: false, example: 'EUR' })
  @IsOptional()
  @IsString()
  public currency?: string;

  @ApiProperty({ description: 'payment_frequency for this contract', required: false, example: 'MONTHLY' })
  @IsOptional()
  @IsString()
  public payment_frequency?: string;

  @ApiProperty({ description: 'supplier_id', required: false, example: '17601a36-9b64-11eb-a8b3-0242ac130003' })
  @IsOptional()
  @IsUUID()
  public supplier_id?: string;

  @ApiProperty({ description: 'name of supplier', required: true, example: 'Delta Tech' })
  @IsString()
  @MinLength(2)
  public supplier_name?: string;

  @ApiProperty({ description: 'title/name of this contract', required: true, example: 'Web Project' })
  @IsString()
  @MinLength(2)
  public title?: string;

  @ApiProperty({ description: 'tags as string comma separated', required: false, example: 'Web Project, react, nodejs, accounting' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  public tags?: string;

  @ApiProperty({ description: 'azure blob url of uploaded file to mercanis system', required: false, example: 'https://mercaniscontractsdev.blob.core.windows.net/mercanis-contracts-dev/b772ff44-af4a-49a9-8c47-d6577ae50d6b-XLSinMercanis.pdf' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  public document?: string;

  @ApiProperty({ description: 'tags as string comma separated', required: false, example: 'XLSinMercanis.pdf' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  public document_originalname?: string;

  @ApiProperty({
    description: 'stakeholder Profile Ids',
    required: false,
    example: ['17601a36-9b64-11eb-a8b3-0242ac130003', '17601a36-9b64-11eb-a8b3-0242ac130006'],
    type: [String],
  })
  @IsOptional()
  @IsUUID('all', { each: true })
  @ArrayUnique()
  public stakeholders?: string[];

  @ApiProperty({ description: 'cancellation period of this contract', required: false, example: 30 })
  @IsOptional()
  @IsInt()
  public cancellation_period?: number;

  @ApiProperty({ description: 'type of status/allowed only Archived while update', required: false, enum: ContractStatus, example: 'ACTIVE' })
  @IsOptional()
  @IsEnum(ContractStatus)
  public status?: string;

}

export class CreateContractParams extends BaseParams {
  @ApiProperty({ description: 'Free text to define the type of contract', required: true, example: 'NDA' })
  @IsString()
  @MinLength(2)
  public contract_type!: string;
}

export class UpdateContractParams extends PartialType(CreateContractParams) {
  @ApiProperty({ description: 'the ID of the contract entity', required: true })
  @IsUUID()
  public id!: string;
}

export class SearchDtoParams {
  @ApiProperty({
    description: "Supplier Id to fetch a list of contracts",
    required: false,
  })
  @IsOptional()
  @IsUUID()
  public supplier_id?: string;

  @ApiProperty({
    description: "Contract type to filter a list of contracts",
    required: false,
  })
  @IsOptional()
  @IsString()
  public contract_type?: string;

  // @ApiProperty({
  //   description: 'Contract tags to filter by',
  //   required: false,
  //   type: [String],
  // })
  // @IsString({ each: true })
  // @IsOptional()
  // public tags?: string[];

  // @ApiProperty({
  //   description: "The least number of days when a contract expires in",
  //   required: false,
  // })
  // @Type(() => Number)
  // @IsOptional()
  // @IsNumber()
  // public expires_in_from?: number;

  @ApiProperty({
    description: "The earliest a contract's start date can be",
    required: false,
    example: "2011-10-05T14:48:00.000Z",
  })
  @IsOptional()
  @IsDateString()
  public start_date?: string;

  @ApiProperty({
    description: "The latest a contract's end date can be",
    required: false,
    example: "2011-10-05T14:48:00.000Z",
  })
  @IsOptional()
  @IsDateString()
  public end_date?: string;

  @ApiProperty({
    description: "Currency of a contract",
    required: false,
    example: "EUR",
  })
  @IsOptional()
  @IsString()
  public currency?: string;

  @ApiProperty({
    description: 'The least amount the contract\'s value can be. In cents!',
    required: false,
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  public contract_value_from?: string;

  @ApiProperty({
    description: 'The greatest amount the contract\'s value can be. In cents!',
    required: false,
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  public contract_value_to?: string;
}