import { Router } from 'express';
import { getProtected } from '../controllers/protected.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/protected', authenticate, getProtected);

export default router;
