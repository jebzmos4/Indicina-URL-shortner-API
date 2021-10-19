/* eslint-disable @typescript-eslint/ban-ts-comment */
/**
 *        @file auth.ts
 *     @summary Check Authentication Class
 * @description Authentication middleware that checks logged in user scope
 *     @service - Service
 *   @functions - check()
 */

import { Service } from '../service';
import { Response, Request, NextFunction } from 'express';
import { ResponseWrapper } from '../helpers/response_wrapper';

export class CheckAuth {
  public async check(
    req: Request,
    res: Response,
    next: NextFunction,
    permission: string
  ) {
    const response: ResponseWrapper = new ResponseWrapper(res);
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return response.forbidden({
        success: false,
        message: 'invalid authorization code'
      });
    }
    const data = await Service.verifyToken(token);
    if (!data.success) {
      return response.unauthorized({
        success: false,
        message: 'invalid authorization code'
      });
    }
    return next();
  }
}

export default new CheckAuth();
