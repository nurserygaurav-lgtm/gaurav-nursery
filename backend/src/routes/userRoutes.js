import { Router } from 'express';
import { approveSeller, getSellers, getUsers } from '../controllers/userController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', protect, authorize('admin'), getUsers);
router.get('/sellers', protect, authorize('admin'), getSellers);
router.patch('/sellers/:id/approve', protect, authorize('admin'), approveSeller);

export default router;
