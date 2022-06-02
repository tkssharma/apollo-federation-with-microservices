import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import * as fs from 'fs/promises';
import { UploadedFileDto } from './file.model';
import { JwtAuthGuard } from '@app/auth/guards/jwt-auth.guard';
import { AdminGuard } from '@app/auth/guards/admin.guard';
import AWSS3Service from '@app/lib/aws-s3/aws-s3.service';
import { FileService } from '../files/files.service';
import { Files } from '../entity/files.entity';
import { UseGuards } from '@nestjs/common';

@Resolver(() => Files)
export class FileResolver {

  constructor(private readonly fileService: FileService) { }
  /*
  working example ::
  curl --location --request POST 'http://localhost:5009/graphql' \
--form 'operations="{\"query\": \"mutation uploadFile($file: Upload!) {  uploadFile(file: $file)} \", \"variables\": {\"file\": null}}"' \
--form 'map="{\"0\": [\"variables.file\"]}"' \
--form '0=@"./mocha.jpg"'

curl --location --request POST 'http://localhost:5009/graphql' \
--form 'operations="{\"query\": \"mutation uploadFile($file: Upload!) {  uploadFile(file: $file){key bucket url}} \", \"variables\": {\"file\": null}}"' \
--form 'map="{\"0\": [\"variables.file\"]}"' \
--form '0=@"./mocha.jpg"'


 curl --location --request POST 'http://localhost:5009/graphql' \
--form 'operations="{\"query\": \"mutation uploadFile($id: String,$file: Upload!) {  uploadFile(id: $id, file: $file){id}} \", \"variables\": {\"file\": null}}"' \
--form 'map="{\"0\": [\"variables.file\"]}"' \
--form 'map="{\"1\": [\"variables.id\"]}"' \
--form '0=@"./mocha.jpg"'
--form '1=@"d23d24dc-e1f1-11ec-8fea-0242ac120002"'
*/
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
      console.log(data);
      return data;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}
