import { solicitacoes } from "../models/solicitacoesModel.js";

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
            throw new Error(`Não é possível alterar uma solicitação no status ${solicitacao.estado}.`);
        }
    }

    atualizarEstado(id, novoEstado, usuario, observacao = ""){
        const solicitacao = this.listarPorId(id);

        const estadoAnterior = solicitacao.estado;
        solicitacao.estado = novoEstado;

        solicitacao.historico.push({
            id: solicitacao.historico.length + 1,
            dataHora: new Date(),
            usuario: usuario || "Usuário do Sistema",
            estadoAnterior: estadoAnterior,
            novoEstado: novoEstado,
            observacao: observacao
        });
        return solicitacao;
    }

    criarSolicitacao(dados){
        if (
            !dados.titulo ||
            !dados.descricao ||
            !dados.valorEstimado ||
            !dados.categoria ||
            !dados.departamento ||
            !dados.prioridade
        ){
            throw new Error("Preencha adequadamente todos os campos obrigatórios.");
        }

        const dataAtual = new Date();

        const novaSolicitacao = {
            id: solicitacoes.length + 1,
            titulo: dados.titulo,
            descricao: dados.descricao,
            valorEstimado: dados.valorEstimado,
            categoria: dados.categoria,
            departamento: dados.departamento,
            prioridade: dados.prioridade,
            estado: "PENDENTE",
            dataCriacao: dataAtual,
            historico: [
                {
                    id: 1,
                    dataHora: dataAtual,
                    usuario: dados.usuarioSolicitante || "Solicitante", 
                    estadoAnterior: null,
                    novoEstado: "PENDENTE",
                    observacao: "Solicitação criada no sistema."
                }
            ]
        };

        solicitacoes.push(novaSolicitacao);
        return novaSolicitacao;
    }

    listarSolicitacoes(){
        return solicitacoes;
    }

    listarPorId(id){
        const solicitacao = solicitacoes.find(s => s.id === Number(id));
        if (!solicitacao) {
            throw new Error("Solicitação não encontrada.");
        }
        return solicitacao;
    }

    atualizar(id, dados){
        const solicitacao = this.listarPorId(id);
        this.validarEdicaoPermitida(solicitacao);

        if (
            !dados.titulo ||
            !dados.descricao ||
            !dados.valorEstimado ||
            !dados.categoria ||
            !dados.departamento ||
            !dados.prioridade
        ) {
            throw new Error("Preencha adequadamente todos os campos obrigatórios.");
        }

        if (dados.estado) {
            this.validarTransicaoEstado(solicitacao.estado, dados.estado);
        }

        const estadoAnterior = solicitacao.estado;

        solicitacao.titulo = dados.titulo;
        solicitacao.descricao = dados.descricao;
        solicitacao.valorEstimado = dados.valorEstimado;
        solicitacao.categoria = dados.categoria;
        solicitacao.departamento = dados.departamento;
        solicitacao.prioridade = dados.prioridade;

        if (dados.estado) {
            solicitacao.estado = dados.estado;
        }

        solicitacao.historico.push({
            id: solicitacao.historico.length + 1,
            dataHora: new Date(),
            usuario: dados.usuario || "Usuário do Sistema",
            estadoAnterior: estadoAnterior,
            novoEstado: solicitacao.estado,
            observacao: dados.observacao || "Solicitação atualizada completamente (PUT)."
        });

        return solicitacao;
    }

    alterar(id, dados) {
        const solicitacao = this.listarPorId(id);
        const estadoAnterior = solicitacao.estado;

        this.validarEdicaoPermitida(solicitacao);

        if (dados.estado) {
            this.validarTransicaoEstado(solicitacao.estado, dados.estado);
        }

        const camposPermitidos = [
            'titulo', 
            'descricao', 
            'valorEstimado', 
            'categoria', 
            'departamento', 
            'prioridade', 
            'estado'
        ];

        let houveAlteracao = false;
        const alteracoes = [];

        camposPermitidos.forEach(campo => {
            if (dados[campo] !== undefined && dados[campo] !== solicitacao[campo]) {
                solicitacao[campo] = dados[campo];
                houveAlteracao = true;
                alteracoes.push(campo);
            }
        });

        if (!houveAlteracao) {
            return solicitacao;
        }

        solicitacao.historico.push({
            id: solicitacao.historico.length + 1,
            dataHora: new Date(),
            usuario: dados.usuario || "Usuário do Sistema",
            estadoAnterior: estadoAnterior,
            novoEstado: solicitacao.estado,
            observacao: dados.observacao || `Alteração parcial nos campos: ${alteracoes.join(', ')}.`
        });

        return solicitacao;
    }

    deletar(id) {
        const index = solicitacoes.findIndex(s => s.id === Number(id));

        if (index === -1) {
            throw new Error("Solicitação não encontrada.");
        }
        const [solicitacaoRemovida] = solicitacoes.splice(index, 1);
        return solicitacaoRemovida;
    }
    
}

export default SolicitacoesService;