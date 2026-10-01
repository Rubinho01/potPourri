import { NextFunction, Request, Response } from 'express';
import { MulterError } from 'multer';
import { AppError } from '../utils/AppError';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  // Erros do multer (ex: arquivo maior que o limite) viram 422 em vez de 500
  if (err instanceof MulterError) {
    res.status(422).json({ message: `Erro no upload: ${err.message}` });
    return;
  }

  console.error('Erro não tratado:', err);
  res.status(500).json({ message: 'Erro interno no servidor' });
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({ message: `Rota não encontrada: ${req.method} ${req.originalUrl}` });
}
