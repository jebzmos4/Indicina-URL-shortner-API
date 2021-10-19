import { Request, Response } from 'express';

export const notFoundHandler = (_req: Request, res: Response): Response => {
  return res.status(404).json({
    success: false,
    message: 'Invalid API call',
    data: {}
  });
};
