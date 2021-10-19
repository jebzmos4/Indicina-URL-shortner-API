/**
 *        @file schema.ts
 *  @repository
 * @application
 *     @summary SchemaMiddleware Class
 * @description Schema middleware that checks and validates request body for each API call
 *   @functions - handle()
 */

import { Response, Request, NextFunction } from 'express';

class SchemaMiddleware {
  public static async handle(
    req: Request,
    res: Response,
    next: NextFunction,
    Validator: any
  ) {
    try {
      if (Validator) {
        await Validator.validateAsync(req.body);
      }
      return next();
    } catch (error) {
      return res.status(400).send({
        success: false,
        message: 'error.details[0].message',
        data: {}
      });
    }
  }
}

export default SchemaMiddleware;
