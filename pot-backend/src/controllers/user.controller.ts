import { Request, Response } from 'express';
import { userService } from '../services/user.service';
import { createUserSchema } from '../utils/user.schema';
import { AppError } from '../utils/AppError';

export const userController = {
  async list(req: Request, res: Response) {
    const users = await userService.findAll();
    res.json(users);
  },

  async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      throw new AppError('Id inválido', 400);
    }
    const user = await userService.findPublicById(id);
    res.json(user);
  },

  // GET /api/auth/me — dados completos do próprio usuário logado (com e-mail e role)
  async me(req: Request, res: Response) {
    const user = await userService.findById(req.user!.id);
    res.json(user);
  },

  async create(req: Request, res: Response) {
    const parsed = createUserSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(parsed.error.issues[0].message, 422);
    }
    const user = await userService.create(parsed.data);
    res.status(201).json(user);
  },

  async remove(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      throw new AppError('Id inválido', 400);
    }
    await userService.delete(id, req.user!.id);
    res.status(204).send();
  },
};
