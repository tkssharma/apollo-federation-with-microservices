import { AuthModule } from '@app/auth/auth.module';
import { LoggerModule } from '@logger/logger.module';
import { Module } from '@nestjs/common';
import { FileResolver } from './file.resolver';
import { TypeOrmModule } from '@nestjs/typeorm'
import { Files } from '../entity/files.entity';
import { DateScalar } from '@app/scalars/date.scalar';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [AuthModule, LoggerModule, FilesModule],
  providers: [FileResolver, DateScalar],
})
export class FileModule {
}
