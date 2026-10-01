import { Router } from 'express';
import { categoryController } from '../controllers/category.controller';
import { asyncHandler } from '../middlewares/asyncHandler';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

// Leitura é pública; qualquer usuário LOGADO pode criar/editar/excluir
// (sem sistema de roles por enquanto — ver README pra evoluir isso)
router.get('/', asyncHandler(categoryController.list));
router.get('/:id', asyncHandler(categoryController.getById));
router.post('/', authMiddleware, asyncHandler(categoryController.create));
router.put('/:id', authMiddleware, asyncHandler(categoryController.update));
router.delete('/:id', authMiddleware, asyncHandler(categoryController.remove));

export default router;
