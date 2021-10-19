/* eslint-disable @typescript-eslint/no-var-requires */
/**
 *        @file service.ts
 *     @summary Service Class
 * @description Define Functions that encrypt and decrypt urls
 *   @functions - encryptURL()
 *              - verifyToken()
 *              - decryptURL()
 */

 import { verifyTokenResponse } from './typings';

export class Service {
  expReq?: any;

  expRes?: any;

  public static verifyToken(bearer: string): verifyTokenResponse {
    if (bearer == process.env.AUTH_TOKEN) {
        return { success: true, response: bearer };
    } else {
        return { success: false, response: 'Invalid Auth Token' };
    }
  }
}

export default Service;
