import { Request, Response } from 'express';
import { categoryService } from '../services/category.service';
import { createCategorySchema, updateCategorySchema } from '../utils/category.schema';
import { AppError } from '../utils/AppError';

export const categoryController = {
  async list(req: Request, res: Response) {
    const categories = await categoryService.findAll();
    res.json(categories);
  },

  async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      throw new AppError('Id inválido', 400);
    }
    const category = await categoryService.findById(id);
    res.json(category);
  },

  async create(req: Request, res: Response) {
    const parsed = createCategorySchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(parsed.error.issues[0].message, 422);
    }
    const category = await categoryService.create(parsed.data);
    res.status(201).json(category);
  },

  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      throw new AppError('Id inválido', 400);
    }
    const parsed = updateCategorySchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(parsed.error.issues[0].message, 422);
    }
    const category = await categoryService.update(id, parsed.data);
    res.json(category);
  },

  async remove(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      throw new AppError('Id inválido', 400);
    }
    await categoryService.delete(id);
    res.status(204).send();
  },
};
