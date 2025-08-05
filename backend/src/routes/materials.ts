import { Router } from 'express';

const router = Router();

// TODO: Implement material routes
router.get('/', (req, res) => res.json({ message: 'Materials route' }));

export default router;