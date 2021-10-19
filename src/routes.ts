import { Router } from 'express';

import express from 'express';
import { wrapper } from '../src/helpers';
import { Controller } from './controller';
import CheckAuth from '../src/middleware/auth';

const router = express.Router();

router.get(
    '/base',
    (req: any, res: any, next: any) => {
      CheckAuth.check(req, res, next, '');  },
    wrapper(Controller.base)
  );

export default router;
