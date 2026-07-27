import { Router } from 'express';
import debugRoutes from './debugRoutes.js';

const router = Router();

router.use('/debug', debugRoutes);

export default router;

