import { ApiBody } from '@nestjs/swagger';

export const uploadFile = (fileName = 'file'): MethodDecorator => (
  target: any,
  propertyKey,
  descriptor: PropertyDescriptor,
) => {
  ApiBody({
    schema: {
      type: 'object',
      properties: {
        [fileName]: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })(target, propertyKey, descriptor);
};
