import { Router } from 'express';
import { addToCart, getCart, removeCartItem, updateCartItem } from '../controllers/cartController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', protect, authorize('customer', 'admin'), getCart);
router.post('/', protect, authorize('customer', 'admin'), addToCart);
router.put('/:id', protect, authorize('customer', 'admin'), updateCartItem);
router.delete('/:id', protect, authorize('customer', 'admin'), removeCartItem);

export default router;
