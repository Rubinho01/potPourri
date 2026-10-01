import { Router } from 'express';
import { postController } from '../controllers/post.controller';
import { asyncHandler } from '../middlewares/asyncHandler';
import { authMiddleware } from '../middlewares/auth';
import { upload } from '../middlewares/upload';

const router = Router();

// Leitura é pública. Criar/editar exigem login + upload.array('images', 3)
// processa o multipart ANTES do controller (limite de 3 arquivos no campo
// "images" — o mínimo de 1 é checado no controller, porque o multer não
// tem um jeito nativo de exigir mínimo).
router.get('/', asyncHandler(postController.list));
router.get('/:id', asyncHandler(postController.getById));
router.post('/', authMiddleware, upload.array('images', 3), asyncHandler(postController.create));
router.put('/:id', authMiddleware, upload.array('images', 3), asyncHandler(postController.update));
router.patch('/:id/active', authMiddleware, asyncHandler(postController.updateActive));
router.delete('/:id', authMiddleware, asyncHandler(postController.remove));

export default router;
