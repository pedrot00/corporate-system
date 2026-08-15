import { UsuariosController} from "../controllers/usuarios.controller.js";
import Router from "express";

const router = Router();
const usuariosController = new UsuariosController();

router.post("/", usuariosController.criar);
router.get("/", usuariosController.listar);
router.get("/:id", usuariosController.listarPorId);
router.put("/:id", usuariosController.atualizar);
router.patch("/:id", usuariosController.alterar);
router.delete("/:id", usuariosController.deletar);

export default router;