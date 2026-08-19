export const solicitacoes = [
    {
        id: 1,
        titulo: "Aquisição de Notebooks para Devs",
        descricao: "5 notebooks alta performance",
        valorEstimado: 25000,
        categoria: "TI",
        departamento: "TI",
        prioridade: "ALTA",
        estado: "APROVADA",
        dataCriacao: "2026-01-15T10:00:00.000Z",
        historico: [
            { id: 1, dataHora: "2026-01-15T10:00:00.000Z", usuario: "João Silva", estadoAnterior: null, novoEstado: "PENDENTE", observacao: "Criado" },
            { id: 2, dataHora: "2026-01-16T14:30:00.000Z", usuario: "Gestor TI", estadoAnterior: "PENDENTE", novoEstado: "APROVADA", observacao: "Aprovado orcamento" }
        ]
    },
    {
        id: 2,
        titulo: "Licenças de Software de Design",
        descricao: "Assinaturas anuais da suíte de design",
        valorEstimado: 12000,
        categoria: "Softwares",
        departamento: "Marketing",
        prioridade: "MÉDIA",
        estado: "EM_COMPRA",
        dataCriacao: "2026-02-10T09:15:00.000Z",
        historico: [
            { id: 1, dataHora: "2026-02-10T09:15:00.000Z", usuario: "Maria Souza", estadoAnterior: null, novoEstado: "PENDENTE", observacao: "Criado" },
            { id: 2, dataHora: "2026-02-11T11:00:00.000Z", usuario: "Gestor Mkt", estadoAnterior: "PENDENTE", novoEstado: "APROVADA", observacao: "Aprovado" },
            { id: 3, dataHora: "2026-02-12T16:00:00.000Z", usuario: "Compras", estadoAnterior: "APROVADA", novoEstado: "EM_COMPRA", observacao: "Enviado fornecedor" }
        ]
    },
    {
        id: 3,
        titulo: "Cadeiras Ergonômicas para Escritório",
        descricao: "10 cadeiras padrão NR17",
        valorEstimado: 8500,
        categoria: "Mobiliário",
        departamento: "RH",
        prioridade: "BAIXA",
        estado: "FINALIZADA",
        dataCriacao: "2026-03-01T11:20:00.000Z",
        historico: [
            { id: 1, dataHora: "2026-03-01T11:20:00.000Z", usuario: "Carlos RH", estadoAnterior: null, novoEstado: "PENDENTE", observacao: "Criado" },
            { id: 2, dataHora: "2026-03-05T15:00:00.000Z", usuario: "Compras", estadoAnterior: "EM_COMPRA", novoEstado: "FINALIZADA", observacao: "Entregue" }
        ]
    },
    {
        id: 4,
        titulo: "Servidores em Nuvem Adicionais",
        descricao: "Upgrade na infraestrutura AWS",
        valorEstimado: 45000,
        categoria: "TI",
        departamento: "TI",
        prioridade: "ALTA",
        estado: "PENDENTE",
        dataCriacao: "2026-04-05T14:00:00.000Z",
        historico: [
            { id: 1, dataHora: "2026-04-05T14:00:00.000Z", usuario: "João Silva", estadoAnterior: null, novoEstado: "PENDENTE", observacao: "Criado" }
        ]
    },
    {
        id: 5,
        titulo: "Treinamento Integrado de Segurança",
        descricao: "Curso de compliance e LGPD",
        valorEstimado: 6000,
        categoria: "Treinamento",
        departamento: "RH",
        prioridade: "MÉDIA",
        estado: "REJEITADA",
        dataCriacao: "2026-05-18T08:45:00.000Z",
        historico: [
            { id: 1, dataHora: "2026-05-18T08:45:00.000Z", usuario: "Carlos RH", estadoAnterior: null, novoEstado: "PENDENTE", observacao: "Criado" },
            { id: 2, dataHora: "2026-05-19T10:00:00.000Z", usuario: "Diretoria", estadoAnterior: "PENDENTE", novoEstado: "REJEITADA", observacao: "Fora do orçamento" }
        ]
    },
    {
        id: 6,
        titulo: "Monitores Ultrawide para Finanças",
        descricao: "4 monitores duplos",
        valorEstimado: 14000,
        categoria: "Hardware",
        departamento: "Finanças",
        prioridade: "ALTA",
        estado: "APROVADA",
        dataCriacao: "2026-06-22T13:30:00.000Z",
        historico: [
            { id: 1, dataHora: "2026-06-22T13:30:00.000Z", usuario: "Ana Finanças", estadoAnterior: null, novoEstado: "PENDENTE", observacao: "Criado" },
            { id: 2, dataHora: "2026-06-23T09:00:00.000Z", usuario: "Diretoria", estadoAnterior: "PENDENTE", novoEstado: "APROVADA", observacao: "Aprovado" }
        ]
    }
];
export const historicoAlteracoes = [];