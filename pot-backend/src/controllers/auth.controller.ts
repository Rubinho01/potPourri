import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { registerSchema, loginSchema, refreshSchema } from '../utils/auth.schema';
import { AppError } from '../utils/AppError';

export const authController = {
  async register(req: Request, res: Response) {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(parsed.error.issues[0].message, 422);
    }
    const tokens = await authService.register(parsed.data);
    res.status(201).json(tokens);
  },

  async login(req: Request, res: Response) {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(parsed.error.issues[0].message, 422);
    }
    const tokens = await authService.login(parsed.data);
    res.json(tokens);
  },

  async refresh(req: Request, res: Response) {
    const parsed = refreshSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(parsed.error.issues[0].message, 422);
    }
    const tokens = await authService.refresh(parsed.data.refreshToken);
    res.json(tokens);
  },

  async logout(req: Request, res: Response) {
    const parsed = refreshSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(parsed.error.issues[0].message, 422);
    }
    await authService.logout(parsed.data.refreshToken);
    res.status(204).send();
  },
};
