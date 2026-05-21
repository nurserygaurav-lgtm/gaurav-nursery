import { Router } from 'express';
import debugRoutes from './debugRoutes.js';

const router = Router();

router.use('/api/debug', debugRoutes);

export default router;

