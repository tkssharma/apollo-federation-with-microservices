import {
  BadRequestException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ENTITY_ACCEPTED, PARAMETERS_FAILED_VALIDATION, RESULTS_RETURNED } from '@app/app.constants';
import { User } from '@auth/decorator/user';
import { UserMetaData } from '@auth/interface/user';
import { RolesAllowed } from '@core/decorator/role.decorator';
import { RolesGuard } from '@core/guard/role.guard';
import { Roles } from '@core/roles';
import { uploadFile } from '../shared/decorator/upload';
import { csvFileFilter } from '../shared/utils/helper';
import ContractUploadService from './home-upload.service';
const getStream = require('into-stream');
import { origins } from '../shared/interface/origin';

@Controller('/api/v1/contracts/bulk-upload')
@ApiBearerAuth('authorization')
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
  }),
)
@ApiHeader({
  name: 'x-api-origin',
  description: 'pass x-api-origin value targeting supplier or purchaser tenant',
  example: 'dev-mercanis-purchaser.eu.auth0.com',
  enum: origins,
  required: false
})
@UseGuards(RolesGuard)
@RolesAllowed(Roles['mercanis-root'], Roles['purchaser-admin'])
export class ContractUploadController {
  constructor(private readonly contractUploadService: ContractUploadService) { }

  @ApiOperation({
    description: 'Bulk Upload contract using *.csv file, use base template for bulk-create Contracts',
  })
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOkResponse({ description: RESULTS_RETURNED })
  @ApiAcceptedResponse({ description: ENTITY_ACCEPTED })
  @ApiBadRequestResponse({ description: PARAMETERS_FAILED_VALIDATION })
  @ApiTags('contracts-upload')
  @ApiConsumes('multipart/form-data')
  @uploadFile('filename')
  @Post('/')
  @UseInterceptors(
    FileInterceptor('filename', {
      fileFilter: csvFileFilter,
    }),
  )
  public async uploadedFile(
    @Req() req: any,
    @UploadedFile() file: any,
    @User() user: UserMetaData,
  ) {
    try {
      if (!file || req.fileValidationError) {
        throw new BadRequestException('invalid file provided, allowed *.csv single file');
      }
      const readStream = getStream(file.buffer);
      await this.contractUploadService.create(readStream, user);
      return { message: 'data validated and being processed' };
    } catch (err) {
      throw err;
    }
  }
}
