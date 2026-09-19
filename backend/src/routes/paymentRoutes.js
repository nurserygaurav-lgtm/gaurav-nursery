import { Router } from 'express';
import { createPaymentOrder, createRazorpayOrder, verifyPayment, verifyRazorpayPayment } from '../controllers/paymentController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/create-order', protect, authorize('customer', 'admin'), createPaymentOrder);
router.post('/verify', protect, authorize('customer', 'admin'), verifyPayment);
router.post('/razorpay/order', protect, authorize('customer', 'admin'), createRazorpayOrder);
router.post('/razorpay/verify', protect, authorize('customer', 'admin'), verifyRazorpayPayment);

export default router;
