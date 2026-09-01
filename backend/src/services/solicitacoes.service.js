import prisma from '../config/prisma.js';

class SolicitacoesService {

  validarTransicaoEstado(estadoAtual, novoEstado) {
    const transicoesPermitidas = {
      "PENDENTE": ["APROVADA", "REJEITADA"],
      "REJEITADA": ["SOLICITACAO_REENVIADA"],
      "SOLICITACAO_REENVIADA": ["APROVADA", "REJEITADA"],
      "APROVADA": ["EM_COMPRA"],
      "EM_COMPRA": ["FINALIZADA"]
    };

    const permitidos = transicoesPermitidas[estadoAtual] || [];

    if (!permitidos.includes(novoEstado)) {
      throw new Error(`Não é permitido alterar o status de ${estadoAtual} para ${novoEstado}.`);
    }
  }

  validarEdicaoPermitida(solicitacao) {
    const estadosImodificaveis = ["APROVADA", "EM_COMPRA", "FINALIZADA"];

    if (estadosImodificaveis.includes(solicitacao.estado)) {
      throw new Error(`Não é possível alterar os dados de uma solicitação no status ${solicitacao.estado}.`);
    }
  }

  async criarSolicitacao(dados, usuarioId) {
    if (!dados.titulo || !dados.descricao || !dados.valorEstimado || !dados.categoria || !dados.departamento || !dados.prioridade) {
      throw new Error("Preencha adequadamente todos os campos obrigatórios.");
    }

    return await prisma.solicitacao.create({
      data: {
        titulo: dados.titulo,
        descricao: dados.descricao,
        valorEstimado: dados.valorEstimado,
        categoria: dados.categoria,
        departamento: dados.departamento,
        prioridade: dados.prioridade,
        estado: "PENDENTE",
        solicitanteId: Number(usuarioId),
        historico: {
          create: {
            usuarioId: Number(usuarioId),
            novoEstado: "PENDENTE",
            observacao: "Solicitação criada no sistema."
          }
        }
      },
      include: {
        solicitante: {
          select: { id: true, nome: true, email: true, departamento: true }
        },
        historico: true
      }
    });
  }

  async listarSolicitacoes(filtros = {}) {
    const { estado, departamento, prioridade, dataInicio, dataFim } = filtros;
    const where = {};

    if (estado) where.estado = estado;
    if (departamento) where.departamento = departamento;
    if (prioridade) where.prioridade = prioridade;

    if (dataInicio || dataFim) {
      where.criadoEm = {};
      if (dataInicio) where.criadoEm.gte = new Date(dataInicio);
      if (dataFim) where.criadoEm.lte = new Date(dataFim);
    }

    return await prisma.solicitacao.findMany({
      where,
      include: {
        solicitante: {
          select: { id: true, nome: true, email: true, departamento: true }
        }
      },
      orderBy: { criadoEm: 'desc' }
    });
  }

  async listarPorId(id) {
    const solicitacao = await prisma.solicitacao.findUnique({
      where: { id: Number(id) },
      include: {
        solicitante: {
          select: { id: true, nome: true, email: true, departamento: true }
        },
        historico: {
          include: {
            usuario: { select: { id: true, nome: true } }
          },
          orderBy: { dataHora: 'asc' }
        }
      }
    });

    if (!solicitacao) {
      throw new Error("Solicitação não encontrada.");
    }

    return solicitacao;
  }

  async atualizarEstado(id, novoEstado, usuarioId, observacao = "") {
    const solicitacao = await this.listarPorId(id);

    this.validarTransicaoEstado(solicitacao.estado, novoEstado);

    return await prisma.solicitacao.update({
      where: { id: Number(id) },
      data: {
        estado: novoEstado,
        historico: {
          create: {
            usuarioId: usuarioId ? Number(usuarioId) : null,
            estadoAnterior: solicitacao.estado,
            novoEstado: novoEstado,
            observacao: observacao || `Status alterado para ${novoEstado}`
          }
        }
      },
      include: {
        historico: true,
        solicitante: { select: { id: true, nome: true, email: true } }
      }
    });
  }

  async alterar(id, dados, usuarioId) {
    const solicitacao = await this.listarPorId(id);

    if (dados.estado && dados.estado !== solicitacao.estado) {
      return await this.atualizarEstado(id, dados.estado, usuarioId, dados.observacao);
    }

    this.validarEdicaoPermitida(solicitacao);

    const camposPermitidos = ['titulo', 'descricao', 'valorEstimado', 'categoria', 'departamento', 'prioridade'];
    const dadosAtualizados = {};
    const alteracoes = [];

    camposPermitidos.forEach((campo) => {
      if (dados[campo] !== undefined && dados[campo] !== solicitacao[campo]) {
        dadosAtualizados[campo] = dados[campo];
        alteracoes.push(campo);
      }
    });

    if (alteracoes.length === 0) return solicitacao;

    return await prisma.solicitacao.update({
      where: { id: Number(id) },
      data: {
        ...dadosAtualizados,
        historico: {
          create: {
            usuarioId: usuarioId ? Number(usuarioId) : null,
            estadoAnterior: solicitacao.estado,
            novoEstado: solicitacao.estado,
            observacao: dados.observacao || `Alteração nos campos: ${alteracoes.join(', ')}.`
          }
        }
      },
      include: {
        historico: true,
        solicitante: { select: { id: true, nome: true, email: true } }
      }
    });
  }

  async deletar(id) {
    await this.listarPorId(id); // Valida se o registro existe antes de deletar

    return await prisma.solicitacao.delete({
      where: { id: Number(id) }
    });
  }
}

export default SolicitacoesService;