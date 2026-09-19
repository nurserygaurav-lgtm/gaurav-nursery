import { Router } from 'express';
import { getAdminDashboard, getSellerDashboard } from '../controllers/dashboardController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/seller', protect, authorize('seller', 'admin'), getSellerDashboard);
router.get('/admin', protect, authorize('admin', 'super_admin'), getAdminDashboard);

export default router;
