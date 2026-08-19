import { solicitacoes } from "../models/solicitacoesModel.js";

class DashboardService {
    listarInformacoes(filtros = {}) {
        const { dataInicio, dataFim, departamento } = filtros;
        let listaFiltrada = [...solicitacoes];

        if (departamento) {
            listaFiltrada = listaFiltrada.filter(s => 
                s.departamento.toLowerCase() === departamento.toLowerCase()
            );
        }

        if (dataInicio && dataFim) {
            const inicio = new Date(dataInicio);
            const fim = new Date(dataFim);
            fim.setHours(23, 59, 59, 999); // Inclui todo o último dia

            listaFiltrada = listaFiltrada.filter(s => {
                const dataCriacao = new Date(s.dataCriacao);
                return dataCriacao >= inicio && dataCriacao <= fim;
            });
        }

        const totalSolicitacoes = listaFiltrada.length;
        const custoTotal = listaFiltrada.reduce((acc, s) => acc + (Number(s.valorEstimado) || 0), 0);
        const ticketMedio = totalSolicitacoes > 0 ? custoTotal / totalSolicitacoes : 0;
        
        const aprovadasCount = listaFiltrada.filter(s => 
            ["APROVADA", "EM_COMPRA", "FINALIZADA"].includes(s.estado)
        ).length;
        
        const taxaAprovacao = totalSolicitacoes > 0 
            ? Number(((aprovadasCount / totalSolicitacoes) * 100).toFixed(1)) 
            : 0;

        const mesesNomes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const evolucaoMap = {};

        listaFiltrada.forEach(s => {
            const data = new Date(s.dataCriacao);
            const mes = mesesNomes[data.getMonth()];
            evolucaoMap[mes] = (evolucaoMap[mes] || 0) + Number(s.valorEstimado || 0);
        });

        const evolucaoMensal = Object.keys(evolucaoMap).map(mes => ({
            mes,
            valor: evolucaoMap[mes]
        }));

        const statusMap = {};
        listaFiltrada.forEach(s => {
            statusMap[s.estado] = (statusMap[s.estado] || 0) + 1;
        });

        const distribuicaoStatus = Object.keys(statusMap).map(status => ({
            name: status,
            value: statusMap[status]
        }));

        const deptoMap = {};
        listaFiltrada.forEach(s => {
            const dep = s.departamento || 'Outros';
            deptoMap[dep] = (deptoMap[dep] || 0) + Number(s.valorEstimado || 0);
        });

        const custoPorDepartamento = Object.keys(deptoMap).map(depto => ({
            depto,
            valor: deptoMap[depto]
        }));

        const prioridadeMap = {};
        listaFiltrada.forEach(s => {
            const prio = s.prioridade || 'BAIXA';
            prioridadeMap[prio] = (prioridadeMap[prio] || 0) + 1;
        });

        const volumePorPrioridade = Object.keys(prioridadeMap).map(prioridade => ({
            prioridade,
            qtd: prioridadeMap[prioridade]
        }));

        return {
            kpis: {
                custoTotal,
                totalSolicitacoes,
                ticketMedio: Number(ticketMedio.toFixed(2)),
                taxaAprovacao
            },
            evolucaoMensal,
            distribuicaoStatus,
            custoPorDepartamento,
            volumePorPrioridade
        };
    }
}

export default DashboardService;