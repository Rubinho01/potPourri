import { Router } from 'express';
import userRoutes from './user.routes';
import authRoutes from './auth.routes';
import categoryRoutes from './category.routes';
import pieceRoutes from './piece.routes';
import postRoutes from './post.routes';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/pieces', pieceRoutes);
router.use('/posts', postRoutes);

export default router;
