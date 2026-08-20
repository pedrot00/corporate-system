import { UsuariosController} from "../controllers/usuarios.controller.js";
import { autenticarToken, autorizarPerfis } from '../middlewares/authMiddleware.js';
import Router from "express";

const router = Router();
const usuariosController = new UsuariosController();

router.post("/", autenticarToken, usuariosController.criar);
router.get("/", autenticarToken, usuariosController.listar);
router.get("/:id", autenticarToken, usuariosController.listarPorId);
router.put("/:id", autenticarToken, usuariosController.atualizar);
router.patch("/:id",autenticarToken, usuariosController.alterar);
router.delete("/:id", autenticarToken, usuariosController.deletar);

export default router;