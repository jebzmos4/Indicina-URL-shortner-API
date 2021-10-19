/* eslint-disable @typescript-eslint/ban-types */
import { Response } from 'express';

interface responseObject {
  success: boolean;
  message: string | void;
  code?: number;
}

export class ResponseWrapper {
  public res: Response;

  constructor(response: Response) {
    this.res = response;
  }

  public handle(
    response: responseObject,
    successCode: number,
    failCode: number
  ): Response {
    if (response.success) {
      return this.res.status(successCode).send(response);
    }

    return this.res.status(failCode).send(response);
  }

  public created(response: responseObject): Response {
    return this.handle(response, 201, 400);
  }

  public ok(response: responseObject): Response {
    return this.handle(response, 200, 400);
  }

  public unprocessableEntity(response: responseObject): Response {
    return this.handle(response, 200, 422);
  }

  public unauthorized(response: responseObject): Response {
    return this.handle(response, 200, 401);
  }

  public forbidden(response: responseObject): Response {
    return this.handle(response, 200, 403);
  }
}
