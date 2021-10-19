/* eslint-disable @typescript-eslint/ban-types */
import { redisObj } from '../src/config';
import Redis from "ioredis";

let connection: any;

export const redisClient = (mediator: any) => {  
    mediator.once('boot.ready', async () => {
      try {
        connection = await new Redis(redisObj);
        mediator.emit('db.ready', connection);
      } catch (e) {
        mediator.emit('db.error', e);
      }
    });
};

export const redisDisconnect = () => {
    connection.disconnect()
}
