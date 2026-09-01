import { NextFunction, Request, Response } from 'express';

type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

// Envolve controllers async e encaminha erros pro errorHandler automaticamente
export const asyncHandler = (fn: AsyncFunction) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
};
