import { Router } from 'express';
import { getSellerDashboard } from '../controllers/dashboardController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/seller', protect, authorize('seller', 'admin'), getSellerDashboard);

export default router;
