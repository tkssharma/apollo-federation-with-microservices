import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import * as fs from 'fs/promises';
import { File, UploadedFileDto } from './file.model';
import { JwtAuthGuard } from '@app/auth/guards/jwt-auth.guard';
import { AdminGuard } from '@app/auth/guards/admin.guard';
import AWSS3Service from '@app/lib/aws-s3/aws-s3.service';
import { FileService } from '../files/files.service';

@Resolver(() => File)
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
*/
  //@UseGuards(JwtAuthGuard, AdminGuard)
  @Mutation(() => Int, { name: 'uploadFile' })
  async uploadFile(
    @Args('file', { type: () => GraphQLUpload }) { file }: { file: FileUpload },
  ): Promise<number | null> {
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
      });
      console.log(data);
      return 1;
    } catch (err) {
      console.log(err);
      return 0;
    }
  }
}
