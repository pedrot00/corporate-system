import { DashboardController } from "../controllers/dashboard.controller.js";
import { autenticar } from '../middlewares/auth.middleware.js';
import Router from "express";

const router = Router();
const dashboardController = new DashboardController();

router.get("/", dashboardController.listar);

export default router;