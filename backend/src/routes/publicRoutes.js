import { Router } from 'express';
import { getStoreSummary } from '../controllers/publicController.js';

const router = Router();
router.get('/summary', getStoreSummary);

export default router;
