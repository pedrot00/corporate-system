import { gerarRelatorio } from '../services/relatorio.service.js';

export const obterRelatorio = async (req, res) => {
  try {
    const { periodo, departamento } = req.query;
    const dados = await gerarRelatorio(periodo, departamento);
    
    return res.status(200).json(dados);
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    return res.status(500).json({ error: 'Erro interno ao processar relatório.' });
  }
};