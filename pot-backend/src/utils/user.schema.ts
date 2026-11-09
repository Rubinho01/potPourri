import { z } from 'zod';
import { USER_ROLES } from '../models/user.model';

// Usado em POST /api/users (só admin). role é opcional: padrão 'user'.
export const createUserSchema = z.object({
  name: z.string({ required_error: 'Nome é obrigatório' }).min(2, 'Nome deve ter ao menos 2 caracteres'),
  email: z.string({ required_error: 'E-mail é obrigatório' }).email('E-mail inválido'),
  password: z.string({ required_error: 'Senha é obrigatória' }).min(6, 'Senha deve ter ao menos 6 caracteres'),
  role: z.enum(USER_ROLES, { message: "Role deve ser 'admin' ou 'user'" }).optional(),
});

export type CreateUserDTO = z.infer<typeof createUserSchema>;
