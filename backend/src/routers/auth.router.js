import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { autenticarToken } from '../middlewares/authMiddleware.js';

const router = Router();
const controller = new AuthController();

router.post('/login', (req, res) => controller.login(req, res));
router.get('/me', autenticarToken, (req, res) => controller.me(req, res));

export default router;