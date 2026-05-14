import { Router } from 'express';
import authRoutes from './authRoutes.js';
import cartRoutes from './cartRoutes.js';
import orderRoutes from './orderRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import productRoutes from './productRoutes.js';
import userRoutes from './userRoutes.js';
import wishlistRoutes from './wishlistRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/cart', cartRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/users', userRoutes);
router.use('/wishlist', wishlistRoutes);

export default router;
