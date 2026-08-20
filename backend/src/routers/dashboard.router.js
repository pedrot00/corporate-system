import { DashboardController } from "../controllers/dashboard.controller.js";
import { autenticarToken, autorizarPerfis } from '../middlewares/authMiddleware.js';
import Router from "express";

const router = Router();
const dashboardController = new DashboardController();

router.get("/", autenticarToken, dashboardController.listar);

export default router;