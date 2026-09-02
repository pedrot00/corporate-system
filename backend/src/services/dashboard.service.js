import prisma from '../config/prisma.js'; // Conectando ao banco real

class DashboardService {
    async listarInformacoes(filtros = {}) {
        const { dataInicio, dataFinal, departamento } = filtros;
        
        // 1. Construir o filtro (WHERE) do banco de dados
        const where = {};

        if (departamento && departamento !== 'TODOS') {
            where.departamento = departamento;
        }

        if (dataInicio && dataFinal) {
            const inicio = new Date(dataInicio);
            const fim = new Date(dataFinal);
            fim.setHours(23, 59, 59, 999); 

            where.criadoEm = {
                gte: inicio,
                lte: fim
            };
        }

        // 2. Buscar solicitações reais no banco
        const listaFiltrada = await prisma.solicitacao.findMany({
            where,
            select: {
                estado: true,
                valorEstimado: true,
                departamento: true,
                categoria: true,
                prioridade: true,
                criadoEm: true,
                atualizadoEm: true
            }
        });

        // 3. Processar os indicadores com os dados reais
        const totalSolicitacoes = listaFiltrada.length;
        const custoTotal = listaFiltrada.reduce((acc, s) => acc + (Number(s.valorEstimado) || 0), 0);
        const ticketMedio = totalSolicitacoes > 0 ? custoTotal / totalSolicitacoes : 0;
        
        const aprovadasCount = listaFiltrada.filter(s => 
            ["APROVADA", "EM_COMPRA", "FINALIZADA"].includes(s.estado)
        ).length;
        
        const taxaAprovacao = totalSolicitacoes > 0 
            ? Number(((aprovadasCount / totalSolicitacoes) * 100).toFixed(1)) 
            : 0;

        // Estruturas Iniciais
        const mesesNomes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const diasSemanaNomes = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        
        const evolucaoMap = {};
        const statusMap = {};
        const deptoMap = {};
        const prioridadeMap = {};
        const sazonalidadeMap = Object.fromEntries(diasSemanaNomes.map(d => [d, 0]));
        const heatMapObj = {};
        const categoriasSet = new Set();
        
        let leadTimeTotalDias = 0;
        let qtdFinalizadas = 0;

        listaFiltrada.forEach(s => {
            const data = new Date(s.criadoEm); // Usando a data do banco
            const valor = Number(s.valorEstimado || 0);
            const dep = s.departamento || 'Outros';
            const cat = s.categoria || 'Geral';
            const prio = s.prioridade || 'BAIXA';

            // Evolução Mensal
            const mes = mesesNomes[data.getMonth()];
            evolucaoMap[mes] = (evolucaoMap[mes] || 0) + valor;

            // Status e Prioridade
            statusMap[s.estado] = (statusMap[s.estado] || 0) + 1;
            prioridadeMap[prio] = (prioridadeMap[prio] || 0) + 1;

            // Gasto por Depto
            deptoMap[dep] = (deptoMap[dep] || 0) + valor;

            // Sazonalidade (Dia da Semana)
            const diaSemana = diasSemanaNomes[data.getDay()];
            sazonalidadeMap[diaSemana] += 1;

            // Mapa de Calor (Depto x Categoria)
            categoriasSet.add(cat);
            if (!heatMapObj[dep]) heatMapObj[dep] = {};
            heatMapObj[dep][cat] = (heatMapObj[dep][cat] || 0) + 1;

            // Lead Time
            if (s.estado === 'FINALIZADA') {
                const dataFimProc = s.atualizadoEm ? new Date(s.atualizadoEm) : new Date(s.criadoEm);
                const diffTime = Math.abs(dataFimProc - data);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                leadTimeTotalDias += diffDays;
                qtdFinalizadas++;
            }
        });

        // Formatação das Saídas
        const evolucaoMensal = Object.keys(evolucaoMap).map(mes => ({ mes, valor: evolucaoMap[mes] }));
        const distribuicaoStatus = Object.keys(statusMap).map(status => ({ name: status, value: statusMap[status] }));
        const custoPorDepartamento = Object.keys(deptoMap).map(depto => ({ depto, valor: deptoMap[depto] }));
        const volumePorPrioridade = Object.keys(prioridadeMap).map(prioridade => ({ prioridade, qtd: prioridadeMap[prioridade] }));
        const sazonalidade = diasSemanaNomes.map(dia => ({ dia, qtd: sazonalidadeMap[dia] }));

        const categoriasUnicas = Array.from(categoriasSet);
        const mapaCalor = {
            categorias: categoriasUnicas,
            dados: Object.keys(heatMapObj).map(depto => {
                const linha = { depto };
                categoriasUnicas.forEach(c => {
                    linha[c] = heatMapObj[depto][c] || 0;
                });
                return linha;
            })
        };

        const leadTimeMedio = qtdFinalizadas > 0 ? (leadTimeTotalDias / qtdFinalizadas) : 0;

        return {
            kpis: {
                custoTotal,
                totalSolicitacoes,
                ticketMedio: Number(ticketMedio.toFixed(2)),
                taxaAprovacao,
                leadTime: Number(leadTimeMedio.toFixed(1))
            },
            evolucaoMensal,
            distribuicaoStatus,
            custoPorDepartamento,
            volumePorPrioridade,
            sazonalidade,
            mapaCalor
        };
    }
}

export default DashboardService;