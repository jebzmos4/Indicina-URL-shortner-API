/* eslint-disable @typescript-eslint/ban-types */
import { redisObj } from '../src/config';
import Redis from "ioredis";
const redis = new Redis(redisObj);

