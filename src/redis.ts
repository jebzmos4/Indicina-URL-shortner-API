import { red } from 'chalk';
/* eslint-disable @typescript-eslint/ban-types */

import { redis } from './server'

export class Redis {
    
    public async set(key: string, value: string) {
        return await redis.set(key, value);
    }

    public async get(key: string) {
        return await redis.get(key);
    }
}
