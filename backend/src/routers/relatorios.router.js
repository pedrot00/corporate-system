import express from 'express';
import { obterRelatorio } from '../controllers/relatorio.controller.js';

const router = express.Router();
router.get('/', obterRelatorio);

export default router;