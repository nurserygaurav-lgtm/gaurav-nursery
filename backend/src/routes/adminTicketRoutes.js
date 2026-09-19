import { Router } from 'express';
import { getAdminTickets } from '../controllers/ticketController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', protect, authorize('admin'), getAdminTickets);

export default router;
