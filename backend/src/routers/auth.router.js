import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { autenticarToken } from '../middlewares/authMiddleware.js';

const router = Router();
const authController = new AuthController();

router.post('/login', authController.login);
router.get('/me', autenticarToken, authController.me);

export default router;