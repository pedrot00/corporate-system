import { Router } from "express";
import { UsuariosController } from "../controllers/usuarios.controller.js";
import { autenticarToken, autorizarPerfis } from '../middlewares/authMiddleware.js';

const router = Router();
const usuariosController = new UsuariosController();

// Bloqueia qualquer rota de usuários para não-ADMINs de uma só vez
router.use(autenticarToken, autorizarPerfis('ADMIN'));

router.post("/", (req, res) => usuariosController.criar(req, res));
router.get("/", (req, res) => usuariosController.listar(req, res));
router.get("/:id", (req, res) => usuariosController.listarPorId(req, res));
router.put("/:id", (req, res) => usuariosController.atualizar(req, res));
router.patch("/:id", (req, res) => usuariosController.alterar(req, res));
router.delete("/:id", (req, res) => usuariosController.deletar(req, res));

export default router;