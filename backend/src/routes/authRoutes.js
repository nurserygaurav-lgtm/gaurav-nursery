import { Router } from 'express';
import { getMe, login, register, googleLogin, logout } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.post('/logout', logout);
router.get('/logout', logout);
router.get('/me', protect, getMe);

export default router;
