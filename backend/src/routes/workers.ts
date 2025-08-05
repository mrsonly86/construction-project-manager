import { Router } from 'express';

const router = Router();

// TODO: Implement worker routes
router.get('/', (req, res) => res.json({ message: 'Workers route' }));

export default router;