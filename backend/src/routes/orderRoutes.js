import { Router } from 'express';
import {
  createOrder,
  getAllOrders,
  getMyOrders,
  getOrderById,
  getSellerOrders,
  updateOrderStatus
} from '../controllers/orderController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', protect, authorize('customer', 'admin'), createOrder);
router.get('/my', protect, authorize('customer', 'admin'), getMyOrders);
router.get('/my-orders', protect, authorize('customer', 'admin'), getMyOrders);
router.get('/seller', protect, authorize('seller', 'admin'), getSellerOrders);
router.get('/', protect, authorize('admin'), getAllOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, authorize('seller', 'admin'), updateOrderStatus);
router.patch('/:id/status', protect, authorize('seller', 'admin'), updateOrderStatus);

export default router;
