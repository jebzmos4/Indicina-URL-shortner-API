import { ExecException } from 'child_process';
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
      try {
        const encodedUrl = await redis.mget(url)
        if (JSON.parse(encodedUrl[0]) !== null) {
            return { success: true, message: url };
        } else {
            // get base url
            const urlString = new URL(url);
            // check base url if valid using the validUrl.isUri method
            if (!validUrl.isUri(urlString.origin)) {
                return {success: false, message: 'Invalid url supplied'}
            }
            const code = nanoid(10);
            const shortUrl = process.env.BASE_URL + '/' + code
            await redis.mset(shortUrl, { url: url, createdAt: new Date().toLocaleString(), redirectCount: 0 })
            return { success: true, message: shortUrl };
        }
      } catch (e: any) {
          return { success: false, message: e.code }
      }
  }
  
  public static async decode(code: string) {
    const url = process.env.BASE_URL + '/' + code
    const decodedData = await redis.mget(url)
    if (JSON.parse(decodedData[0]) !== null) {
        const parsedData = JSON.parse(decodedData);
        const shortUrl = parsedData.url
        parsedData.redirectCount = Number(parsedData.redirectCount) + 1;
        await redis.mset(url,  parsedData)
        return { success: true, message: shortUrl };
    } else {
        return { success: false, message: 'shortened url does not exist' };
    }
  }

  public static async statistics(code: string) {
    const url = process.env.BASE_URL + '/' + code
    const decodedUrl = await redis.mget(url)
    if (JSON.parse(decodedUrl[0]) !== null) {
        return { success: true, message: JSON.parse(decodedUrl) };
    } else {
        return { success: true, message: 'shortened url does not exist' };
    }
  }
}

export default Service;
