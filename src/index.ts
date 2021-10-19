import express from 'express';
import { EventEmitter } from 'events';
import dotenv from 'dotenv';
dotenv.config();
import { server } from './config';
import { redisClient, redisDisconnect } from './db';
import { startServer } from './server';
import { logger } from './providers/logger';
const mediator = new EventEmitter();

const app = express();

/**
 * @author event listener when the repository has been connected
 */
mediator.on('db.ready', (connection) => {
  logger.info({
    message: '🌴 Redis Database connection was successful!'
  });
  return startServer(app, express).then((app: any) => {
    logger.info({
      message: `🚀 Server started successfully, running on port: ${server.port}.`
    });
    logger.info({
      message: `Server :: Running @ 'http://localhost:${server.port}'`
    });
    app.on('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        logger.info({
          message: 'Address in use, retrying...'
        });
        setTimeout(() => {
          app.close();
          app.listen(server.port);
        }, 1000);
      }
    });
    app.on('close', () => {
        redisDisconnect();
    });
  });
});

/**
 * @author database error occurred
 */
mediator.on('db.error', (err) => {
  logger.error({
    message: `ERROR: Database connection failed!!`,
    stacK: err
  });
});

/**
 * @author we load the connection to the database
 */
redisClient(mediator);

/**
 * @author init the app, and the event listener will handle the rest
 */
mediator.emit('boot.ready');
