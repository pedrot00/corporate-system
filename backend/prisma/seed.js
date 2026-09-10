import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcrypt';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const catalogos = {
  'Equipamentos de TI': { min: 1500, max: 10000, itens: ['Notebook Dell', 'Monitor 27"', 'Servidor', 'Nobreak'] },
  'Licenças de Software': { min: 200, max: 1200, itens: ['Adobe CC', 'AWS Mensal', 'Windows 11', 'Microsoft 365'] },
  'Material de Escritório': { min: 50, max: 300, itens: ['Papel A4', 'Toner HP', 'Kit Canetas', 'Grampeador'] },
  'Serviços de Manutenção': { min: 300, max: 1500, itens: ['Manutenção AC', 'Reparo Servidor', 'Instalação Rede'] },
  'Mobiliário': { min: 800, max: 3500, itens: ['Cadeira Ergonômica', 'Mesa de Reunião', 'Gaveteiro'] }
};

const departamentos = ['RH', 'TI', 'Financeiro', 'Contabilidade', 'Comercial', 'Operações'];

const sortearComPeso = (opcoes, pesos) => {
  const total = pesos.reduce((a, b) => a + b, 0);
  let aleatorio = Math.random() * total;
  for (let i = 0; i < opcoes.length; i++) {
    if (aleatorio < pesos[i]) return opcoes[i];
    aleatorio -= pesos[i];
  }
  return opcoes[opcoes.length - 1];
};

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const gerarDataPonderada = () => {
  // Pesos: Dom(5), Seg(40), Ter(10), Qua(10), Qui(25), Sex(5), Sab(5)
  const diaAlvo = sortearComPeso([0, 1, 2, 3, 4, 5, 6], [5, 40, 10, 10, 25, 5, 5]);
  
  // Variação de datas: "mesmo ano" (365d), "90 dias", "30 dias", "7 dias"
  const diasMaximos = sortearComPeso([365, 90, 30, 7], [20, 40, 25, 15]);
  
  const hoje = new Date('2026-09-10T12:00:00Z').getTime();
  const inicio = hoje - (diasMaximos * 24 * 60 * 60 * 1000);

  let dataValida;
  while (true) {
    dataValida = new Date(inicio + Math.random() * (hoje - inicio));
    if (dataValida.getDay() === diaAlvo) break;
  }
  return dataValida;
};

async function main() {
  console.log('🌱 Conectando ao NeonDB e iniciando carga da Seed...');
  const senhaPadrao = await bcrypt.hash('123456', 10);

  const usuariosData = [
    { nome: 'João Silva', email: 'joao@empresa.com', senha: senhaPadrao, perfil: 'FUNCIONARIO', departamento: 'Comercial' },
    { nome: 'Carlos Albuquerque', email: 'gestor@empresa.com', senha: senhaPadrao, perfil: 'GESTOR', departamento: 'Financeiro' },
    { nome: 'Vitória Nascimento', email: 'admin@empresa.com', senha: senhaPadrao, perfil: 'ADMIN', departamento: 'TI' },
    { nome: 'Pedro S. Teixeira', email: 'pedro.s@gmail.com', senha: senhaPadrao, perfil: 'ADMIN', departamento: 'TI' },
    { nome: 'Júllia Maria', email: 'jullia.m@gmail.com', senha: senhaPadrao, perfil: 'GESTOR', departamento: 'Operações' },
    { nome: 'Igor Azevedo', email: 'igor.a@gmail.com', senha: senhaPadrao, perfil: 'FUNCIONARIO', departamento: 'RH' }
  ];

  const usuariosCriados = [];
  for (const u of usuariosData) {
    const user = await prisma.usuario.upsert({
      where: { email: u.email },
      update: {},
      create: u
    });
    usuariosCriados.push(user);
  }

  const categoriasKeys = Object.keys(catalogos);
  const statusPossiveis = ['PENDENTE', 'REJEITADA', 'APROVADA', 'EM_COMPRA', 'FINALIZADA'];

  console.log('⏳ Processando 80 solicitações...');

  for (let i = 0; i < 80; i++) {
    // Probabilidade: MEDIA (55%), BAIXA (30%), ALTA (15%)
    const prioridade = sortearComPeso(['BAIXA', 'MEDIA', 'ALTA'], [30, 55, 15]);
    const statusFinal = statusPossiveis[randomInt(0, statusPossiveis.length - 1)];
    
    const categoria = categoriasKeys[randomInt(0, categoriasKeys.length - 1)];
    const itemNome = catalogos[categoria].itens[randomInt(0, catalogos[categoria].itens.length - 1)];
    const valorEstimado = randomInt(catalogos[categoria].min, catalogos[categoria].max);
    
    const usuarioSorteado = usuariosCriados[randomInt(0, usuariosCriados.length - 1)];
    const dataCriacao = gerarDataPonderada();

    const solicitacao = await prisma.solicitacao.create({
      data: {
        titulo: `Aquisição de ${itemNome}`,
        descricao: `Pedido gerado automaticamente - Lote ${i + 1}`,
        categoria,
        departamento: usuarioSorteado.departamento,
        prioridade,
        estado: statusFinal,
        valorEstimado,
        solicitanteId: usuarioSorteado.id,
        criadoEm: dataCriacao,
        atualizadoEm: dataCriacao
      }
    });

    let dataAtual = new Date(dataCriacao);
    let estadoAnterior = null;

    const registrarHistorico = async (novoEstado, obs, diasAdicionais) => {
      dataAtual.setDate(dataAtual.getDate() + diasAdicionais);
      await prisma.historicoSolicitacao.create({
        data: {
          solicitacaoId: solicitacao.id,
          usuarioId: usuarioSorteado.id,
          estadoAnterior: estadoAnterior,
          novoEstado: novoEstado,
          observacao: obs,
          dataHora: new Date(dataAtual)
        }
      });
      estadoAnterior = novoEstado;
    };

    await registrarHistorico('PENDENTE', 'Solicitação inicial gerada via sistema.', 0);

    if (statusFinal !== 'PENDENTE') {
      if (statusFinal === 'REJEITADA') {
        await registrarHistorico('REJEITADA', 'Orçamento reprovado pela diretoria.', randomInt(1, 3));
      } else {
        await registrarHistorico('APROVADA', 'Verba validada. Encaminhado para compras.', randomInt(1, 3));
        
        if (['EM_COMPRA', 'FINALIZADA'].includes(statusFinal)) {
          await registrarHistorico('EM_COMPRA', 'Cotações em andamento com fornecedores.', randomInt(2, 5));
          
          if (statusFinal === 'FINALIZADA') {
            await registrarHistorico('FINALIZADA', 'Produto entregue e nota fiscal recebida.', randomInt(1, 4));
          }
        }
      }
    }
    
    await prisma.solicitacao.update({
      where: { id: solicitacao.id },
      data: { atualizadoEm: dataAtual }
    });
  }

  console.log('🎉 Sucesso! 80 registros inseridos no NeonDB respeitando o Schema.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { 
    await prisma.$disconnect(); 
    await pool.end();
  });