import { SolicitacoesController } from "../controllers/solicitacoes.controller.js";
import { autenticarToken, autorizarPerfis } from '../middlewares/authMiddleware.js';
import { Router } from "express";

const router = Router();
const solicitacoesController = new SolicitacoesController();

router.use(autenticarToken);

router.post("/", (req, res) => solicitacoesController.criar(req, res));
router.get("/", (req, res) => solicitacoesController.listar(req, res));
router.get("/:id", (req, res) => solicitacoesController.listarPorId(req, res));
router.put("/:id", (req, res) => solicitacoesController.atualizar(req, res));
router.patch("/:id", (req, res) => solicitacoesController.alterar(req, res));

// Restringe a exclusão apenas para usuários ADMIN
router.delete("/:id", autorizarPerfis("ADMIN"), (req, res) => solicitacoesController.deletar(req, res));

export default router;