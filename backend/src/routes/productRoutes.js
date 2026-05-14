import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  getSellerProducts,
  searchProducts,
  updateProduct
} from '../controllers/productController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = Router();

router.get('/', getProducts);
router.get('/search', searchProducts);
router.get('/seller', protect, authorize('seller', 'admin'), getSellerProducts);
router.get('/:id', getProductById);
router.post('/', protect, authorize('seller', 'admin'), upload.array('images', 6), createProduct);
router.put('/:id', protect, authorize('seller', 'admin'), upload.array('images', 6), updateProduct);
router.delete('/:id', protect, authorize('seller', 'admin'), deleteProduct);

export default router;
