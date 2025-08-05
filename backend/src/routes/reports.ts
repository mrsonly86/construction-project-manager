import { Router } from 'express';

const router = Router();

// TODO: Implement report routes
router.get('/', (req, res) => res.json({ message: 'Reports route' }));

export default router;