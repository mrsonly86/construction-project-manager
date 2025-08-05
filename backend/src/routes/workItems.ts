import { Router } from 'express';

const router = Router();

// TODO: Implement work item routes
router.get('/', (req, res) => res.json({ message: 'Work items route' }));

export default router;