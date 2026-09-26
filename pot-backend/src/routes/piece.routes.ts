import { Router } from 'express';
import { pieceController } from '../controllers/piece.controller';
import { asyncHandler } from '../middlewares/asyncHandler';
import { authMiddleware } from '../middlewares/auth';
import { upload } from '../middlewares/upload';

const router = Router();

// Leitura pública; escrita exige login. upload.single('photo') processa o
// multipart/form-data ANTES do controller — o arquivo chega em req.file.
router.get('/', asyncHandler(pieceController.list));
router.get('/:id', asyncHandler(pieceController.getById));
router.post('/', authMiddleware, upload.single('photo'), asyncHandler(pieceController.create));
router.put('/:id', authMiddleware, upload.single('photo'), asyncHandler(pieceController.update));
router.delete('/:id', authMiddleware, asyncHandler(pieceController.remove));

export default router;
