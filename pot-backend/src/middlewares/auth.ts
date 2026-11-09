import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { AppError } from '../utils/AppError';

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Token de acesso não fornecido', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyAccessToken(token);
    // Token sem role (emitido antes desta mudança) é tratado como usuário comum
    req.user = { id: payload.sub, role: payload.role === 'admin' ? 'admin' : 'user' };
    next();
  } catch {
    throw new AppError('Token de acesso inválido ou expirado', 401);
  }
}

// Use SEMPRE depois do authMiddleware: router.post('/', authMiddleware, requireAdmin, ...)
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    throw new AppError('Token de acesso não fornecido', 401);
  }
  if (req.user.role !== 'admin') {
    throw new AppError('Apenas administradores podem realizar esta ação', 403);
  }
  next();
}
