import { Router } from 'express';
import { z } from 'zod';
import type { UserRole } from '@gaurav-nursery/types';

const router = Router();
const registerSchema = z.object({ name: z.string().trim().min(2).max(100), email: z.string().email(), password: z.string().min(12).max(128) });

router.post('/register', (req, res) => {
  const input = registerSchema.parse(req.body);
  // Public registration always creates a customer. Seller onboarding is a separate KYC workflow.
  const role: UserRole = 'customer';
  res.status(202).json({ data: { email: input.email.toLowerCase(), role, nextStep: 'verify_email' } });
});

router.post('/login', (_req, res) => res.status(501).json({ error: { code: 'NOT_IMPLEMENTED', message: 'Login service is being migrated to v2' } }));
router.post('/refresh', (_req, res) => res.status(501).json({ error: { code: 'NOT_IMPLEMENTED', message: 'Refresh-token service is being migrated to v2' } }));
export default router;
