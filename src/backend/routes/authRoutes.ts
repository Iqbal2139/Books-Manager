import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { validateRequest, authSchema } from '../middleware/validate';

const router = Router();

router.post('/register', validateRequest(authSchema), register);
router.post('/login', validateRequest(authSchema), login);

export default router;
