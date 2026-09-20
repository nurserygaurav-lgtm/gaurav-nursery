import { Router } from 'express';
import { getDeliveryOrders, updateDeliveryStatus } from '../controllers/deliveryController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect, authorize('delivery_partner', 'DELIVERY_PARTNER', 'admin', 'super_admin', 'SUPER_ADMIN'));

router.get('/', getDeliveryOrders);
router.patch('/', updateDeliveryStatus);
router.post('/status', updateDeliveryStatus);

export default router;
