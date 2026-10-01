import { z } from 'zod';

// pieceIds chega como STRING porque o post é enviado via multipart/form-data
// (por causa das imagens). O cliente deve mandar um JSON stringificado no
// campo, ex: form-data com pieceIds = "[1,2,3]"
const pieceIdsField = z.preprocess((val) => {
  if (typeof val === 'string') {
    try {
      return JSON.parse(val);
    } catch {
      return val; // deixa a validação abaixo reportar o erro de formato
    }
  }
  return val;
}, z.array(z.coerce.number().int().positive()).min(1, 'Selecione ao menos uma peça'));

// multipart/form-data também manda boolean como string ("true"/"false").
const booleanField = z.preprocess((val) => {
  if (typeof val === 'string') {
    if (val === 'true') return true;
    if (val === 'false') return false;
  }
  return val;
}, z.boolean());

export const createPostSchema = z.object({
  pieceIds: pieceIdsField,
  isActive: booleanField.optional(),
});

export const updatePostSchema = z.object({
  pieceIds: pieceIdsField.optional(),
  isActive: booleanField.optional(),
});

// PATCH /posts/:id/active chega como JSON "normal" (sem upload), então aqui
// um z.boolean() simples já basta.
export const updatePostActiveSchema = z.object({
  isActive: z.boolean({
    required_error: 'isActive é obrigatório',
    invalid_type_error: 'isActive precisa ser true ou false',
  }),
});

export type CreatePostDTO = z.infer<typeof createPostSchema>;
export type UpdatePostDTO = z.infer<typeof updatePostSchema>;
