import { Router } from 'express';
import { getOrdersTest } from '../controllers/debugController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/authMiddleware.js';

const router = Router();

// Lightweight endpoint for isolating Mongo/query slowness.
// Must be protected so seller auth applies.
router.get('/orders-test', protect, authorize('seller', 'admin'), getOrdersTest);

export default router;

