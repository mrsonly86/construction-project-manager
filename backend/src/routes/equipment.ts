import { Router } from 'express';

const router = Router();

// TODO: Implement equipment routes
router.get('/', (req, res) => res.json({ message: 'Equipment route' }));

export default router;