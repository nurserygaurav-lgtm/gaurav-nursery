import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  bulkDeleteProducts,
  deleteTodayProducts,
  debugTodayProducts,
  bulkImportProducts,
  downloadProductImportSample,
  getProductById,
  getProducts,
  getSellerProducts,
  searchProducts,
  updateProduct
} from '../controllers/productController.js';


import { authorize, protect } from '../middleware/authMiddleware.js';
import { importUpload, upload } from '../middleware/uploadMiddleware.js';

const router = Router();

router.get('/', getProducts);
router.get('/search', searchProducts);
router.get('/seller', protect, authorize('seller', 'admin'), getSellerProducts);
router.get('/import/sample', protect, authorize('seller', 'admin'), downloadProductImportSample);
router.post('/import', protect, authorize('seller', 'admin'), importUpload.single('file'), bulkImportProducts);
router.get('/:id', getProductById);
router.post('/', protect, authorize('seller', 'admin'), upload.array('images', 6), createProduct);
router.put('/:id', protect, authorize('seller', 'admin'), upload.array('images', 6), updateProduct);
router.delete('/bulk-delete', protect, authorize('seller', 'admin'), bulkDeleteProducts);
router.delete('/:id', protect, authorize('seller', 'admin'), deleteProduct);

// Admin-only: delete all products uploaded today
router.delete('/delete-today-products', protect, authorize('admin'), deleteTodayProducts);

// Debug: inspect today's products match window
router.get('/debug-today-products', protect, authorize('admin'), debugTodayProducts);

export default router;


