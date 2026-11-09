import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { asyncHandler } from '../middlewares/asyncHandler';
import { authMiddleware, requireAdmin } from '../middlewares/auth';

const router = Router();

// Regra do projeto: só o admin cadastra (e exclui) usuários.
// GET /:id continua público porque o perfil do vendedor usa essa rota.
router.get('/', authMiddleware, requireAdmin, asyncHandler(userController.list));
router.get('/:id', asyncHandler(userController.getById));
router.post('/', authMiddleware, requireAdmin, asyncHandler(userController.create));
router.delete('/:id', authMiddleware, requireAdmin, asyncHandler(userController.remove));

export default router;
