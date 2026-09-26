import { z } from 'zod';

// Esses dados chegam via multipart/form-data (por causa do upload de foto),
// então todo campo chega como string — por isso o z.coerce.number() em categoryId.
export const createPieceSchema = z.object({
  description: z.string().min(3, 'Descrição deve ter ao menos 3 caracteres'),
  link: z.string().url('Link inválido').optional().or(z.literal('')),
  size: z.string().min(1, 'Tamanho é obrigatório'),
  categoryId: z.coerce.number().int().positive('categoryId inválido'),
});

export const updatePieceSchema = createPieceSchema.partial();

export type CreatePieceDTO = z.infer<typeof createPieceSchema>;
export type UpdatePieceDTO = z.infer<typeof updatePieceSchema>;
