import express from 'express';
import { wrapper } from '../src/helpers';
import { Controller } from './controller';
import CheckAuth from '../src/middleware/auth';

const router = express.Router();

router.get(
    '/base',
    wrapper(Controller.base)
  );

  router.post(
    '/encode',
    (req: any, res: any, next: any) => {
      CheckAuth.check(req, res, next, '');  },
    wrapper(Controller.encode)
  );

  router.get(
    '/:code',
    wrapper(Controller.decode)
  );

  router.get(
    '/statistics/:code',
    (req: any, res: any, next: any) => {
      CheckAuth.check(req, res, next, '');  },
    wrapper(Controller.statistics)
  );

export default router;
