// Native.
import { format } from "util";

// Package.
import debug from "debug";
import { Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";

import {
  FileMetadataParam,
  FileOperationParam,
  FileQueryParam,
  FilterDtoParam,
} from "./files.dto";
import FileDaoService from "./file.dao.service";
import { File } from "../entity/files.entity";

// Code.
@Injectable()
export class FileService {
  constructor(
    private readonly fileDaoService: FileDaoService
  ) { }


  async list() {
    try {
      const files = await this.fileDaoService.ListAll();
      return files;
    } catch (err) {
      if (err instanceof Error) {
        throw err;
      }
    }
  }

  async delete(
    user: any,
    query: FileQueryParam,
    param: FileOperationParam
  ) {
    const file = await this.fileDaoService.getByFileId(
      param.file_id);
    if (file) {
      return await this.fileDaoService.delete(file.id);
    }
    throw new NotFoundException();
  }


  async listByReference(reference_id: string) {
    try {
      const files = await this.fileDaoService.getByReferenceIdId(
        reference_id
      );
      console.log(files);
      return files[0];
    } catch (err) {
      if (err instanceof Error) {
        throw err;
      }
    }
  }
  async listByReferenceId(reference_id: string) {
    try {
      const files = await this.fileDaoService.getByReferenceIdId(
        reference_id
      );
      console.log(files);
      return files[0];
    } catch (err) {
      if (err instanceof Error) {
        throw err;
      }
    }
  }
  async getById(id: string) {
    try {
      const file = await this.fileDaoService.getByFileId(
        id
      );
      return file;
    } catch (err) {
      if (err instanceof Error) {
        throw err;
      }
    }
  }
  async upload(file: any, reference_id: string) {
    try {
      console.log(file, reference_id);
      const fileUploadResult = [];
      const fileName = `${uuidv4()}-${file.filename}`;
      console.log(file.buffer, fileName, file.filename);
      const fileUploadedResponse = await this.fileDaoService.upload(
        file.buffer,
        fileName,
        file.filename
      );

      const response: File = await this.fileDaoService.create(
        {
          name: file.filename,
          reference_id: reference_id,
          storage_unique_name: fileUploadedResponse.Key,
          url: fileUploadedResponse.url,
          mimetype: file.mimetype
        }
      );

      fileUploadResult.push({
        ...response,
        id: response.id,
        success: true,
      });
      return fileUploadResult;
    } catch (err) {
      console.log(err);
      if (err instanceof Error) {
        throw err;
      }
    }
  }
}
