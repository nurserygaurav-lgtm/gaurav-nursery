import { Router } from 'express';
import authRoutes from './authRoutes.js';
import cartRoutes from './cartRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import orderRoutes from './orderRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import productRoutes from './productRoutes.js';
import ticketRoutes from './ticketRoutes.js';
import adminTicketRoutes from './adminTicketRoutes.js';
import userRoutes from './userRoutes.js';
import wishlistRoutes from './wishlistRoutes.js';
import publicRoutes from './publicRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/cart', cartRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/public', publicRoutes);
router.use('/tickets', ticketRoutes);
router.use('/admin/tickets', adminTicketRoutes);
router.use('/users', userRoutes);
router.use('/wishlist', wishlistRoutes);

export default router;
