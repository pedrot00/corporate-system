import SolicitacoesService from '../services/solicitacoes.service.js';

const solicitacaoService = new SolicitacoesService();

class SolicitacoesController {

  async criar(req, res) {
    try {
      const usuarioId = req.usuario?.id;
      const novaSolicitacao = await solicitacaoService.criarSolicitacao(req.body, usuarioId);
      return res.status(201).json(novaSolicitacao);
    } catch (erro) {
      return res.status(400).json({ erro: erro.message });
    }
  }

  async listar(req, res) {
    try {
      const solicitacoes = await solicitacaoService.listarSolicitacoes(req.query);
      return res.status(200).json(solicitacoes);
    } catch (error) {
      return res.status(400).json({ erro: error.message });
    }
  }

  async listarPorId(req, res) {
    try {
      const reqId = req.params.id;
      const solicitacao = await solicitacaoService.listarPorId(reqId);
      return res.status(200).json(solicitacao);
    } catch (error) {
      return res.status(404).json({ erro: error.message });
    }
  }

  async alterar(req, res) {
    try {
      const reqId = req.params.id;
      const usuarioId = req.usuario?.id;
      const solicitacaoAtualizada = await solicitacaoService.alterar(reqId, req.body, usuarioId);
      return res.status(200).json(solicitacaoAtualizada);
    } catch (error) {
      return res.status(400).json({ erro: error.message });
    }
  }

  async atualizar(req, res) {
    return this.alterar(req, res);
  }

  async deletar(req, res) {
    try {
      const reqId = req.params.id;
      await solicitacaoService.deletar(reqId);
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ erro: error.message });
    }
  }
}

export { SolicitacoesController };