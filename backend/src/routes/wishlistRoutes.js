import { Router } from 'express';
import { addToWishlist, getWishlist, removeFromWishlist } from '../controllers/wishlistController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', protect, authorize('customer', 'admin'), getWishlist);
router.post('/', protect, authorize('customer', 'admin'), addToWishlist);
router.delete('/:id', protect, authorize('customer', 'admin'), removeFromWishlist);

export default router;
