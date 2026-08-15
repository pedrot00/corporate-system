import { SolicitacoesController} from "../controllers/solicitacoes.controller.js";
import { autenticar } from '../middlewares/auth.middleware.js';
import Router from "express";


const router = Router();
const solicitacoesController = new SolicitacoesController();

router.post("/", solicitacoesController.criar);
router.get("/", solicitacoesController.listar);
router.get("/:id", solicitacoesController.listarPorId);
router.put("/:id", solicitacoesController.atualizar);
router.patch("/:id", solicitacoesController.alterar);
router.delete("/:id", solicitacoesController.deletar);
router.use(autenticar);

export default router;