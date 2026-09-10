import UsuariosService from "../services/usuarios.service.js";

const usuariosService = new UsuariosService();

class UsuariosController {

  async criar(req, res) {
    try {
      const novoUsuario = await usuariosService.criarUsuario(req.body);
      return res.status(201).json(novoUsuario);
    } catch (erro) {
      return res.status(400).json({ erro: erro.message });
    }
  }

  async listar(req, res) {
    try {
      const listaUsuarios = await usuariosService.listarUsuarios();
      return res.status(200).json(listaUsuarios);
    } catch (error) {
      return res.status(400).json({ erro: error.message });
    }
  }

  async listarPorId(req, res) {
    try {
      const reqId = req.params.id;
      const usuario = await usuariosService.listarPorId(reqId);
      return res.status(200).json(usuario);
    } catch (error) {
      return res.status(404).json({ erro: error.message });
    }
  }

  async atualizar(req, res) {
    try {
      const reqId = req.params.id;
      const usuarioAtualizado = await usuariosService.atualizar(reqId, req.body);
      return res.status(200).json(usuarioAtualizado);
    } catch (error) {
      return res.status(400).json({ erro: error.message });
    }
  }

  async alterar(req, res) {
    try {
      const reqId = req.params.id;
      const usuarioAtualizado = await usuariosService.alterar(reqId, req.body);
      return res.status(200).json(usuarioAtualizado);
    } catch (error) {
      return res.status(400).json({ erro: error.message });
    }
  }

  async deletar(req, res) {
    try {
      const reqId = req.params.id;
      const adminId = req.usuarioId || req.usuario?.id || req.user?.id || req.body.adminId;
      const senhaAdmin = req.body.senhaAdmin;

      await usuariosService.deletar(reqId, adminId, senhaAdmin);
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ erro: error.message });
    }
  }
}

export { UsuariosController };