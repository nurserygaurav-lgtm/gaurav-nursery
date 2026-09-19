import { Router } from 'express';
import {
  createTicket,
  getMyTickets,
  getTicketById,
  replyTicket,
  updateTicketStatus,
  deleteTicket
} from '../controllers/ticketController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';
import { ticketUpload } from '../middleware/uploadMiddleware.js';

const router = Router();

router.post('/create', protect, authorize('seller', 'admin'), ticketUpload.array('attachments', 5), createTicket);
router.get('/my', protect, authorize('seller', 'admin'), getMyTickets);
router.get('/:id', protect, authorize('seller', 'admin'), getTicketById);
router.put('/reply/:id', protect, authorize('seller', 'admin'), ticketUpload.array('attachments', 5), replyTicket);
router.put('/status/:id', protect, authorize('seller', 'admin'), updateTicketStatus);
router.delete('/:id', protect, authorize('admin'), deleteTicket);

export default router;
