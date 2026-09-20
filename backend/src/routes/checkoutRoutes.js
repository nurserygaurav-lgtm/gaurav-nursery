import { Router } from 'express';
import { processCheckout } from '../controllers/checkoutController.js';

const router = Router();

router.post('/', processCheckout);

export default router;
