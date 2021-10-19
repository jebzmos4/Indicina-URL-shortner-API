/* eslint-disable @typescript-eslint/no-var-requires */
/**
 *        @file service.ts
 *     @summary Service Class
 * @description Define Functions that encrypt and decrypt urls
 *   @functions - encryptURL()
 *              - verifyToken()
 *              - decryptURL()
 */

import { nanoid } from 'nanoid'
import * as validUrl from 'valid-url';
import { Redis } from './redis';

const redis = new Redis();

export class Service {
  expReq?: any;

  expRes?: any;

  public static verifyToken(bearer: string) {
    if (bearer == process.env.AUTH_TOKEN) {
        return { success: true, response: bearer };
    } else {
        return { success: false, response: 'Invalid Auth Token' };
    }
  }

  public static async encode(url: string) {
    const encodedUrl: string | void = await redis.get(url)
    if (encodedUrl !== null) {
        return { success: true, message: encodedUrl };
    } else {
        // get base url
        const urlString = new URL(url);
        // check base url if valid using the validUrl.isUri method
        if (!validUrl.isUri(urlString.origin)) {
            return {success: false, message: 'Invalid url supplied'}
        }
        const code = nanoid(10);
        const shortUrl = process.env.BASE_URL + '/' + code
        redis.set(shortUrl, url)
        return { success: true, message: shortUrl };
    }
  }
  
  public static async decode(code: string) {
    const url = process.env.BASE_URL + '/' + code
    const decodedUrl: string | void = await redis.get(url)
    if (decodedUrl !== null) {
        return { success: true, message: decodedUrl };
    } else {
        return { success: true, message: 'shortened url does not exist' };
    }
  }

  public static async statistics(code: string) {
    const url = process.env.BASE_URL + '/' + code
    const decodedUrl: string | void = await redis.get(url)
    if (decodedUrl !== null) {
        return { success: true, message: decodedUrl };
    } else {
        return { success: true, message: 'shortened url does not exist' };
    }
  }
}

export default Service;
