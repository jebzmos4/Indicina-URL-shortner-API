/**
 *        @file app.ts
 *     @summary Application Controller Class.
 * @description This file contains function(s) which returns Application related data.
 *   @functions - version()
 *     @returns Express JSON Response
 */

import { Response, Request } from 'express';
import { ResponseWrapper } from './helpers/response_wrapper';

export class Controller {

  public static async base(
    req: Request,
    res: Response
  ) {
    const response: ResponseWrapper = new ResponseWrapper(res);
    return response.ok({
      success: true,
      message: 'Welcome to Indicina API'
    });
  }
}
