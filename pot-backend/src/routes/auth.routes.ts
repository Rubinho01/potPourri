import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { asyncHandler } from '../middlewares/asyncHandler';
import { authMiddleware } from '../middlewares/auth';
import { userController } from '../controllers/user.controller';

const router = Router();

// Sem /register público: só admin cria usuário, em POST /api/users
router.post('/login', asyncHandler(authController.login));
router.post('/refresh', asyncHandler(authController.refresh));
router.post('/logout', asyncHandler(authController.logout));
router.get('/me', authMiddleware, asyncHandler(userController.me));

export default router;
