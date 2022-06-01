import { ApiProperty, ApiResponseProperty } from "@nestjs/swagger";
import {
  IsDefined,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from "class-validator";

export class FileQueryParam {
  @ApiProperty({
    description: "external_id",
    required: false,
    example: "e3b90d62-1469-11ec-82a8-0242ac130003",
  })
  @IsOptional()
  @IsUUID()
  public external_id!: string;
}

export class RequiredFileQueryParam {
  @ApiProperty({
    description: "external_id",
    required: true,
    example: "e3b90d62-1469-11ec-82a8-0242ac130003",
  })
  @IsUUID()
  public external_id!: string;
}

export class FileOperationParam {
  @ApiProperty({
    description: "file_id",
    required: true,
    example: "e3b90d62-1469-11ec-82a8-0242ac130003",
  })
  @IsUUID()
  public file_id!: string;
}

export class FilterDtoParam {
  @ApiProperty({
    description: "file name for search",
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsDefined()
  public name?: string;
}

export class FileMetadataParam {
  @ApiProperty({
    description: "metadata",
    example: {
      comment: "My comment for this file",
    },
  })
  @IsDefined()
  public metadata!: any;
}
