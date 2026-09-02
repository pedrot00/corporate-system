import prisma from '../config/prisma.js'; 

const formatarMoeda = (valor) => 
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

const CATEGORIAS_FILTRO = [
  'Equipamentos de TI',
  'Licenças de Software',
  'Material de Escritório',
  'Serviços de Manutenção',
  'Mobiliário'
];

export const gerarRelatorio = async (periodo, departamento) => {
  const where = {};
  
  if (departamento && departamento !== 'TODOS') {
    where.departamento = departamento; 
  }

  if (periodo) {
    const dataFiltro = new Date();
    if (periodo === '7dias') dataFiltro.setDate(dataFiltro.getDate() - 7);
    else if (periodo === '30dias') dataFiltro.setDate(dataFiltro.getDate() - 30);
    else if (periodo === '90dias') dataFiltro.setDate(dataFiltro.getDate() - 90);
    else if (periodo === 'ano') dataFiltro.setMonth(0, 1);
    
    where.criadoEm = { gte: dataFiltro }; 
  }

  const solicitacoes = await prisma.solicitacao.findMany({
    where,
    select: {
      estado: true,
      valorEstimado: true,
      categoria: true,
      solicitante: {
        select: { nome: true }
      }
    }
  });

  let totalFinalizadoNum = 0;
  let pedidosConcluidos = 0;
  let qtdAprovados = 0;
  let qtdEmCompra = 0;
  let qtdRejeitadas = 0;
  let qtdPendentes = 0;

  const categoriasMap = {};
  CATEGORIAS_FILTRO.forEach(cat => {
    categoriasMap[cat] = { quantidade: 0, totalNum: 0 };
  });

  const solicitantesMap = {};

  solicitacoes.forEach(sol => {
    const valor = sol.valorEstimado ? Number(sol.valorEstimado) : 0;
    const cat = sol.categoria;
    const nomeUsuario = sol.solicitante?.nome || 'Usuário Desconhecido';

    if (sol.estado === 'FINALIZADA') {
      totalFinalizadoNum += valor;
      pedidosConcluidos++;
    } else if (sol.estado === 'APROVADA') {
      qtdAprovados++;
    } else if (sol.estado === 'EM_COMPRA') {
      qtdEmCompra++;
    } else if (sol.estado === 'REJEITADA') {
      qtdRejeitadas++;
    } else if (sol.estado === 'PENDENTE') { 
      qtdPendentes++;
    }

    // REGRA ALTERADA: Só contabiliza a categoria se o estado for FINALIZADA
    if (CATEGORIAS_FILTRO.includes(cat) && sol.estado === 'FINALIZADA') {
      categoriasMap[cat].quantidade++;
      categoriasMap[cat].totalNum += valor;
    }

    // Mantém o Top Solicitantes contando todas as solicitações do usuário
    if (!solicitantesMap[nomeUsuario]) {
      solicitantesMap[nomeUsuario] = { quantidade: 0, valorTotalNum: 0 };
    }
    solicitantesMap[nomeUsuario].quantidade++;
    solicitantesMap[nomeUsuario].valorTotalNum += valor;
  });

  const ticketMedioNum = pedidosConcluidos > 0 ? (totalFinalizadoNum / pedidosConcluidos) : 0;

  const tabelaCategorias = CATEGORIAS_FILTRO.map(cat => ({
    categoria: cat,
    quantidade: categoriasMap[cat].quantidade,
    total: formatarMoeda(categoriasMap[cat].totalNum)
  }));

  const topSolicitantes = Object.keys(solicitantesMap)
    .map(nome => ({
      nome,
      quantidade: solicitantesMap[nome].quantidade,
      total: formatarMoeda(solicitantesMap[nome].valorTotalNum)
    }))
    .sort((a, b) => b.quantidade - a.quantidade)
    .slice(0, 5);

  return {
    resumo: {
      totalFinalizado: formatarMoeda(totalFinalizadoNum),
      pedidosConcluidos,
      ticketMedio: formatarMoeda(ticketMedioNum),
      qtdAprovados,
      qtdEmCompra,
      qtdRejeitadas,
      qtdPendentes
    },
    tabela: tabelaCategorias,
    topSolicitantes 
  };
};