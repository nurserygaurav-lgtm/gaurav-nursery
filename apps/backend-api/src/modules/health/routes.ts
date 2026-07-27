import { Router } from 'express';
const router = Router();
router.get('/', (_req, res) => res.json({ data: { status: 'ok', service: 'gaurav-nursery-api-v2', timestamp: new Date().toISOString() } }));
export default router;
