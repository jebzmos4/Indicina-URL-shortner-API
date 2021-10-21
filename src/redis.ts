/* eslint-disable @typescript-eslint/ban-types */

import { redis } from './server'

export class Redis {

    public async mset(key: string, object: object) {
        return await redis.mset(key, JSON.stringify(object))
    }

    public async mget(key: string) {
        return await redis.mget(key)
    }

    public async incrby(key: string, value: number) {
        return await redis.incrby(key, value)
    }
}
