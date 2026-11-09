import { Router } from 'express';
import { categoryController } from '../controllers/category.controller';
import { asyncHandler } from '../middlewares/asyncHandler';
import { authMiddleware, requireAdmin } from '../middlewares/auth';

const router = Router();

// Leitura é pública; só o admin cria/edita/exclui categorias
router.get('/', asyncHandler(categoryController.list));
router.get('/:id', asyncHandler(categoryController.getById));
router.post('/', authMiddleware, requireAdmin, asyncHandler(categoryController.create));
router.put('/:id', authMiddleware, requireAdmin, asyncHandler(categoryController.update));
router.delete('/:id', authMiddleware, requireAdmin, asyncHandler(categoryController.remove));

export default router;
