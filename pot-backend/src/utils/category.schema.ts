import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(2, 'Nome da categoria deve ter ao menos 2 caracteres'),
});

export const updateCategorySchema = createCategorySchema;

export type CreateCategoryDTO = z.infer<typeof createCategorySchema>;
