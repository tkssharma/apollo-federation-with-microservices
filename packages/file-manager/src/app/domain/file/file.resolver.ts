import { Args, Int, Mutation, Query, ResolveProperty, Resolver, ResolveReference } from '@nestjs/graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import * as fs from 'fs/promises';
import { JwtAuthGuard } from '@app/auth/guards/jwt-auth.guard';
import { AdminGuard } from '@app/auth/guards/admin.guard';
import { FileService } from '../files/files.service';
import { File } from '../entity/files.entity';
import { UseGuards } from '@nestjs/common';

@Resolver(() => File)
export class FileResolver {

  constructor(private readonly fileService: FileService) { }
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Mutation()
  async uploadFile(
    @Args('id') id: string,
    @Args('file', { type: () => GraphQLUpload }) { file }: { file: FileUpload },
  ): Promise<any> {
    try {
      const { filename,
        mimetype } = file;
      const { createReadStream } = file;

      const stream = createReadStream();
      const chunks: any = [];

      const buffer = await new Promise<Buffer>((resolve, reject) => {
        let buffer: Buffer;
        stream.on('data', function (chunk) {
          chunks.push(chunk);
        });
        stream.on('end', function () {
          buffer = Buffer.concat(chunks);
          resolve(buffer);
        });
        stream.on('error', reject);
      });
      const data = await this.fileService.upload({
        buffer,
        filename
      }, id);
      return data;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  // ! critical require fix [apollo doesn't deal with array response from sub-graph]
  @ResolveReference()
  async resolveReference(reference: { __typename: string; id: string }) {
    return await this.fileService.listByReference(reference.id)
  }

  @ResolveProperty()
  async FileList(reference: { __typename: string; id: string }) {
    const data = await this.fileService.listByReferenceId(reference.id);
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>');
    return { idRef: reference.id, files: data }
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Query()
  async file(
    @Args('id') id: string) {
    return await this.fileService.getById(id)
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Query()
  async files() {
    return await this.fileService.list()
  }

}
