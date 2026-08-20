import { SolicitacoesController} from "../controllers/solicitacoes.controller.js";
import { autenticarToken, autorizarPerfis } from '../middlewares/authMiddleware.js';
import Router from "express";


const router = Router();
const solicitacoesController = new SolicitacoesController();

router.post("/", autenticarToken, solicitacoesController.criar);
router.get("/", autenticarToken, solicitacoesController.listar);
router.get("/:id", autenticarToken, solicitacoesController.listarPorId);
router.put("/:id", autenticarToken, solicitacoesController.atualizar);
router.patch("/:id", autenticarToken, solicitacoesController.alterar);
router.delete("/:id", autenticarToken, solicitacoesController.deletar);

export default router;