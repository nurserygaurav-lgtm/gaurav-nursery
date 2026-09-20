import { Router } from 'express';
import {
  getAdminMetrics,
  getAdminProducts,
  moderateProduct,
  bulkModerateProducts,
  getAdminSellers,
  moderateSeller,
  getAdminCommissionLedgers,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  exportReports
} from '../controllers/adminController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = Router();

// Protect all admin routes: only admin or super_admin
router.use(protect, authorize('admin', 'super_admin', 'SUPER_ADMIN'));

router.get('/metrics', getAdminMetrics);

// Product moderation
router.get('/products', getAdminProducts);
router.patch('/products', moderateProduct);
router.post('/products/bulk', bulkModerateProducts);

// Seller KYC moderation
router.get('/sellers', getAdminSellers);
router.patch('/sellers', moderateSeller);

// Commission ledger & reports
router.get('/commission', getAdminCommissionLedgers);
router.get('/reports/export', exportReports);

// Coupons
router.get('/coupons', getCoupons);
router.post('/coupons', createCoupon);
router.patch('/coupons/:id', updateCoupon);
router.delete('/coupons/:id', deleteCoupon);

// Banners
router.get('/banners', getBanners);
router.post('/banners', createBanner);
router.patch('/banners/:id', updateBanner);
router.delete('/banners/:id', deleteBanner);

export default router;
