import { Body, Delete, Get, Param, Put, Query, Res, UseGuards } from '@nestjs/common';
import {
  BadRequestException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UploadedFile,
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
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { ENTITY_FOUND } from '@app/app.constants';
import { RolesAllowed } from '@core/decorator/role.decorator';
import { RolesGuard } from '@core/guard/role.guard';
import { Roles } from '@core/roles';

import {
  ENTITY_CREATED,
  ENTITY_DELETED,
  ENTITY_MODIFIED,
  INTERNAL_SERVER_ERROR,
  PARAMETERS_FAILED_VALIDATION,
  RESULTS_RETURNED,
} from '@app/app.constants';
import { User } from '@auth/decorator/user';
import { UserMetaData } from '@auth/interface/user';
import {
  ContractByIdPathParams,
  SearchDtoParams,
  CreateContractParams,
  UpdateContractParams,
} from "./contract.dto";
import ContractService from './home.service';
import { ApiFilterQuery } from '@core/decorator/query-filter';
import { pdfFileFilter } from '../shared/utils/helper';
import { uploadFile } from '../shared/decorator/upload';
import { origins } from '../shared/interface/origin';
import { Logger } from '@logger/logger';

@Controller('/api/v1/contracts')
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
export class ContractController {
  constructor(
    private readonly contractService: ContractService,
    private readonly logger: Logger,
  ) { }

  @UseGuards(RolesGuard)
  @RolesAllowed(Roles['mercanis-root'], Roles['purchaser-admin'], Roles['purchaser-user'])
  @ApiTags('contracts')
  @Get('/')
  @ApiFilterQuery('filter', SearchDtoParams)
  @ApiOperation({ description: 'Get All contracts for a Purchaser' })
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: RESULTS_RETURNED })
  @ApiBadRequestResponse({ description: PARAMETERS_FAILED_VALIDATION })
  @ApiInternalServerErrorResponse({ description: 'data has been fetched successfully' })
  public async getAllContracts(
    @Query('filter') filter: SearchDtoParams,
    @User() user: UserMetaData
  ) {
    try {
      return await this.contractService.listAll(user, filter);
    } catch (errors) {
      this.logger.error(errors as any);
      throw errors;
    }
  }

  @UseGuards(RolesGuard)
  @RolesAllowed(Roles['mercanis-root'], Roles['purchaser-admin'], Roles['purchaser-user'])
  @ApiTags('contracts')
  @Get('/:id')
  @ApiOperation({ description: 'Get contract based on UUID' })
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: RESULTS_RETURNED })
  @ApiBadRequestResponse({ description: PARAMETERS_FAILED_VALIDATION })
  @ApiInternalServerErrorResponse({ description: 'data has been fetched successfully' })
  public async getContractById(@Param() params: ContractByIdPathParams, @User() user: UserMetaData) {
    try {
      return await this.contractService.getById(params, user);
    } catch (errors) {
      this.logger.error(errors as any);
      throw errors;
    }
  }

  @UseGuards(RolesGuard)
  @RolesAllowed(Roles['mercanis-root'], Roles['purchaser-admin'])
  @ApiTags('contracts')
  @ApiInternalServerErrorResponse({
    description: INTERNAL_SERVER_ERROR,
  })
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ description: ENTITY_CREATED })
  @ApiBadRequestResponse({ description: PARAMETERS_FAILED_VALIDATION })
  @Post('/')
  @ApiOperation({ description: 'Create new contract' })
  public async createContract(@Body() params: CreateContractParams, @User() user: UserMetaData) {
    try {
      return await this.contractService.create(params, user);
    } catch (errors) {
      this.logger.error(errors as any);
      throw errors;
    }
  }

  @UseGuards(RolesGuard)
  @RolesAllowed(Roles['mercanis-root'], Roles['purchaser-admin'])
  @ApiInternalServerErrorResponse({
    description: INTERNAL_SERVER_ERROR,
  })
  @ApiOkResponse({ description: ENTITY_MODIFIED })
  @HttpCode(HttpStatus.OK)
  @ApiBadRequestResponse({ description: PARAMETERS_FAILED_VALIDATION })
  @ApiTags('contracts')
  @ApiOperation({ description: 'Update contract based on UUID' })
  @Put('/')
  public async updateContract(@Body() payload: UpdateContractParams, @User() user: UserMetaData) {
    try {
      return await this.contractService.update(payload, user);
    } catch (errors) {
      this.logger.error(errors as any);
      throw errors;
    }
  }

  @UseGuards(RolesGuard)
  @RolesAllowed(Roles['mercanis-root'], Roles['purchaser-admin'])
  @ApiInternalServerErrorResponse({
    description: INTERNAL_SERVER_ERROR,
  })
  @ApiOperation({ description: 'Delete CONTRACT based on UUID' })
  @ApiOkResponse({ description: ENTITY_DELETED })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBadRequestResponse({ description: PARAMETERS_FAILED_VALIDATION })
  @ApiTags('contracts')
  @Delete('/:id')
  public async deleteContract(@Param() params: ContractByIdPathParams, @User() user: UserMetaData) {
    try {
      await this.contractService.delete(params, user);
    } catch (errors) {
      this.logger.error(errors as any);
      throw errors;
    }
  }

  @UseGuards(RolesGuard)
  @RolesAllowed(Roles['mercanis-root'], Roles['purchaser-admin'])
  @ApiOperation({
    description: 'Upload contract document for contract id ',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: RESULTS_RETURNED })
  @ApiAcceptedResponse({ description: ENTITY_MODIFIED })
  @ApiBadRequestResponse({ description: PARAMETERS_FAILED_VALIDATION })
  @ApiTags('contracts')
  @ApiConsumes('multipart/form-data')
  @uploadFile('filename')
  @Post('/upload')
  @UseInterceptors(
    FileInterceptor('filename', {
      fileFilter: pdfFileFilter,
    }),
  )
  public async uploadedFile(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
    @User() user: UserMetaData
  ) {
    try {
      if (!file || req.fileValidationError) {
        throw new BadRequestException('invalid file provided, allowed *.pdf single file for Contract');
      }
      return await this.contractService.upload(file);
    } catch (err) {
      this.logger.error(err as any);
      throw err;
    }
  }

  @UseGuards(RolesGuard)
  @RolesAllowed(Roles['mercanis-root'], Roles['purchaser-admin'], Roles['purchaser-user'])
  @ApiInternalServerErrorResponse({
    description: INTERNAL_SERVER_ERROR,
  })
  @ApiOperation({ description: 'download contract file based on contract Id' })
  @ApiOkResponse({ description: ENTITY_FOUND })
  @HttpCode(HttpStatus.OK)
  @ApiBadRequestResponse({ description: PARAMETERS_FAILED_VALIDATION })
  @ApiTags('contracts')
  @Get('/:id/download')
  public async downloadContracts(
    @Param() params: ContractByIdPathParams,
    @User() user: UserMetaData,
    @Res() res: Response) {
    try {
      // tslint:disable-next-line:naming-convention
      const { document: downloadFile, document_originalname } = await this.contractService.download(user, params);
      res.setHeader('X-Document-Name', document_originalname);
      downloadFile.pipe(res);
    } catch (errors) {
      this.logger.error(errors as any);
      throw errors;
    }
  }
}
