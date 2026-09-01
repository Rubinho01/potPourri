import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { asyncHandler } from '../middlewares/asyncHandler';

const router = Router();

router.get('/', asyncHandler(userController.list));
router.get('/:id', asyncHandler(userController.getById));
router.post('/', asyncHandler(userController.create));
router.delete('/:id', asyncHandler(userController.remove));

export default router;
