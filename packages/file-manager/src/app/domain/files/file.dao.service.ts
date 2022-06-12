import AWSS3Service from "@app/lib/aws-s3/aws-s3.service";
import { Logger } from "@logger/logger";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { File } from "../entity/files.entity";

@Injectable()
export default class FileDaoService {
  constructor(
    @InjectRepository(File) private readonly userUploadRepo: Repository<File>,
    private readonly logger: Logger,
    private readonly s3: AWSS3Service

  ) { }

  async create(payload: Partial<File>): Promise<File> {
    try {
      return await this.userUploadRepo.save(payload)
    } catch (err) {
      throw err;
    }
  }

  async upload(file: Buffer, key: string, originalname: string) {
    return this.s3.upload(file, key, originalname);
  }

  async delete(fileId: string) {
    const file = await this.userUploadRepo.findOne({ where: { id: fileId } })
    if (file) {
      // file.deleted_at = new Date();
      return await this.userUploadRepo.save(file);
    }
    throw new NotFoundException();
  }

  async getByFileId(
    fileId: string
  ): Promise<File | undefined> {
    const file = await this.userUploadRepo.findOne({ where: { id: fileId } })

    if (file) {
      const s3PresignedUrl = file.url;
      const isExpired = await this.s3.isPreSignedUrlExpired(s3PresignedUrl);

      if (isExpired) {
        const newUrl = await this.s3.getPresignedUrl(
          file.storage_unique_name,
          file.name
        );
        file.url = newUrl;
        const response = await this.userUploadRepo.save(file);
        return response;
      } else {
        return file;
      }
    }
  }

  async ListAll(): Promise<File[]> {
    const storedFile = [];
    const File = await this.userUploadRepo.find({ where: {} })


    for (const file of File) {
      const fileUrlExpired = await this.s3.isPreSignedUrlExpired(file.url);
      if (fileUrlExpired) {
        const newUrl = await this.s3.getPresignedUrl(
          file.storage_unique_name,
          file.name
        );
        file.url = newUrl;
        const updatedFile = await this.userUploadRepo.save(file);
        storedFile.push(updatedFile);
      } else {
        storedFile.push(file);
      }
    }

    return storedFile;
  }

  async getByReferenceIdId(referenceId: string): Promise<File[]> {
    const storedFile = [];
    const File = await this.userUploadRepo.find({ where: { reference_id: referenceId } })

    for (const file of File) {
      const fileUrlExpired = await this.s3.isPreSignedUrlExpired(file.url);
      if (fileUrlExpired) {
        const newUrl = await this.s3.getPresignedUrl(
          file.storage_unique_name,
          file.name
        );
        file.url = newUrl;
        const updatedFile = await this.userUploadRepo.save(file);
        storedFile.push(updatedFile);
      } else {
        storedFile.push(file);
      }
    }
    return storedFile;
  }
}
