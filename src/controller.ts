/**
 *        @file app.ts
 *     @summary Application Controller Class.
 * @description This file contains function(s) which returns Application related data.
 *   @functions - version()
 *     @returns Express JSON Response
 */

import { Response, Request } from 'express';
import * as Joi from 'joi';
import { ResponseWrapper } from './helpers/response_wrapper';
import { EncodeRequest } from './typings';
import { Service } from './service';

export class Controller {
  public redisClient: any

  constructor(redis: any) {
    this.redisClient = redis;
  }

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

  public static async encode(
    req: EncodeRequest,
    res: Response,

  ) {

    try {
      const response: ResponseWrapper = new ResponseWrapper(res);

      const schema = Joi.object().keys({
        url: Joi.string().required()
      });

      const { error } = schema.validate({
        ...req.body
      });
      if (error) {
        return response.unprocessableEntity({ success: false, message: error.message })
      }

      const { url } = req.body
      const result = await Service.encode(url);
  
      if (result.success) {
        return response.ok(result);
      }
      return response.unprocessableEntity(result);
    } catch (e) {
      return (e)
    }
  }
}
