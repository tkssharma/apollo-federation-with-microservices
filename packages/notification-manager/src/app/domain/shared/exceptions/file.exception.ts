
import { NotFoundException } from '@nestjs/common';

export class FileNotFoundException extends NotFoundException {
  initialError?: Error | unknown;

  constructor(err?: Error | unknown) {
    super('file not found for operation');
    this.message = 'File not found or user do not have access to that resource';
    this.initialError = err;
  }
}