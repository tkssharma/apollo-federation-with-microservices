import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response, Request } from 'express';
import AuthService from '@auth/services/auth.service';

// postgres column json can't be inserted as json 
// type cast to string needed
const KEYS_TO_PROCESS = [
  'metadata'
];

export const convertPayloadJSONObjectsToStrings = (data: any) => {
  const entries = Object.entries(data).map(([key, value], index) => {
    return [key, KEYS_TO_PROCESS.indexOf(key) !== -1 ? JSON.stringify(value) : value];
  });
  return Object.fromEntries(entries);
};
@Injectable()
export class ConvertPayloadJSONObjectToString implements NestMiddleware {

  constructor(private authorizationService: AuthService) { }

  public async use(req: Request, res: Response, next: NextFunction) {
    const data = req.body;

    if (!data) {
      next();
    }
    req.body = convertPayloadJSONObjectsToStrings(data);
    next();
  }
}
