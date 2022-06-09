import { LoggerModule } from "@logger/logger.module";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { File } from "../entity/files.entity";
import FileDAOService from "./file.dao.service";
import { FileService } from "./files.service";

@Module({
  imports: [LoggerModule, TypeOrmModule.forFeature([File])],
  controllers: [],
  providers: [FileService, FileDAOService],
  exports: [FileService, FileDAOService],
})
export class FilesModule { }
