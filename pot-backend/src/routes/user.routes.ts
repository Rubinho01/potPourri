import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { asyncHandler } from '../middlewares/asyncHandler';
import { authMiddleware, requireAdmin } from '../middlewares/auth';

const router = Router();

// Regra do projeto: só o admin cadastra (e exclui) usuários.
// GET /:id é público (perfil do vendedor) e devolve só id, nome e data de cadastro.
// Os dados completos do próprio usuário ficam em GET /api/auth/me.
router.get('/', authMiddleware, requireAdmin, asyncHandler(userController.list));
router.get('/:id', asyncHandler(userController.getById));
router.post('/', authMiddleware, requireAdmin, asyncHandler(userController.create));
router.delete('/:id', authMiddleware, requireAdmin, asyncHandler(userController.remove));

export default router;
