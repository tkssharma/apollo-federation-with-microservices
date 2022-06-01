import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import * as fs from 'fs/promises';
import { File } from './file.model';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@app/auth/guards/jwt-auth.guard';
import { AdminGuard } from '@app/auth/guards/admin.guard';

@Resolver(() => File)
export class FileResolver {
  /*
  working example ::
  curl --location --request POST 'http://localhost:5009/graphql' \
--form 'operations="{\"query\": \"mutation uploadFile($file: Upload!) {  uploadFile(file: $file)} \", \"variables\": {\"file\": null}}"' \
--form 'map="{\"0\": [\"variables.file\"]}"' \
--form '0=@"./mocha.jpg"'
*/
  //@UseGuards(JwtAuthGuard, AdminGuard)
  @Mutation(() => Int, { name: 'uploadFile' })
  async uploadFile(
    @Args('file', { type: () => GraphQLUpload }) { file }: { file: FileUpload },
  ): Promise<number> {
    try {
      console.log(file);
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

      const base64 = buffer.toString('base64');
      // If you want to store the file, this is one way of doing
      // it, as you have the file in-memory as Buffer
      await fs.writeFile('upload.jpg', buffer);

      return base64.length;
    } catch (err) {
      console.log(err);
      return 0;
    }
  }
}
