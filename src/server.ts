/**
 *        @file index.ts
 *  @repository 000-a-3100_api_boilerplate
 * @application 000-a-3100_api_boilerplate
 *     @summary Starting point of the application
 * @description Handles the following middlwares:
 *              - CORS and Logger
 *              - Swagger
 *              - API routes
 *              - Auto Update Schema
 *              - Server
 */
import http from 'http';
import routes from './routes';
import CORS from './providers/cors';
import * as config from './config';
import { notFoundHandler } from './helpers';
import { initRequest, logResponse } from './providers/logger';

let RedisClient: any;

const main = (app: any, express: any, connection: any): Promise<any> => {
  RedisClient = connection;
  /**
   * HTTP and console logging middleware using winston package
   */
  return new Promise((resolve, reject) => {
    app.use(initRequest);
    app.use(logResponse);

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json({ limit: '1.5MB' }));
    app.use(CORS.handle);

    // set token experiation and secret
    app.set('tokenSecret', config.server.apiUuid); // secret variable used for Jwt encoding
    app.set('tokenExpire', config.server.tokenExpiration);

    // set versions
    app.use('/v1', routes);
    app.use('*', notFoundHandler);

    // create server
    const server = http.createServer(app);
    const port = config.server.port || 5002;
    server.listen(port, () => resolve(server));
  });
};

export { main as startServer };
export { RedisClient as redis };