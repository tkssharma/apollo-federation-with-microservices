import { LoggerModule } from "@logger/logger.module";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserUploads } from "../entity/files.entity";
import FileDAOService from "./file.dao.service";
import { FileService } from "./files.service";

@Module({
  imports: [LoggerModule, TypeOrmModule.forFeature([UserUploads])],
  controllers: [],
  providers: [FileService, FileDAOService],
  exports: [FileService, FileDAOService],
})
export class FilesModule { }
