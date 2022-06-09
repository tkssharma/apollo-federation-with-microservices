import { ApiResponseProperty } from "@nestjs/swagger";

export class NotificationListResponse {

  @ApiResponseProperty({
    example:
      "da9b9f51-23b8-4642-97f7-52537b3cf53b",
    format: "v4",
  })
  id: string;

  @ApiResponseProperty({
    example:
      "da9b9f51-23b8-4642-97f7-52537b3cf53b",
    format: "v4",
  })
  external_id: string;

  @ApiResponseProperty({
    example:
      "email test",
  })
  name: string;

  @ApiResponseProperty({
    example:
      "email",
  })
  type: string;

  @ApiResponseProperty({
    example:
      "recipient_name",
  })
  recipient_name: string;

  @ApiResponseProperty({
    example:
      "recipient_email",
  })
  recipient_email: string;

  @ApiResponseProperty({
    example:
      {},
  })
  template_data: any;

  @ApiResponseProperty({
    example:
    "da9b9f51-23b8-4642-97f7-52537b3cf53b",
  })
  sender_id: string;

}