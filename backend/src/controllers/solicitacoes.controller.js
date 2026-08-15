import SolicitacoesService from '../services/solicitacoes.service.js';

const solicitacaoService = new SolicitacoesService();
class SolicitacoesController{

    criar(req, res){
        try{
            const dadosSolicitacao = {
                ...req.body,
                usuario: req.usuarioLogado.nome
            };
            const novaSolicitacao = solicitacaoService.criarSolicitacao(dadosSolicitacao);
            return res.status(201).json(novaSolicitacao);
        } 
        catch (erro){
            return res.status(400).json({ erro: erro.message });
        }
    }

    listar(req, res){
        try{
            const solicitacoes = solicitacaoService.listarSolicitacoes();
            return res.status(200).json(solicitacoes);
        }   
        catch(error){
            return res.status(400).json({ erro: error.message});
        }
    }

    listarPorId(req, res){
        try{
            const reqId = req.params.id;
            const solicitacao = solicitacaoService.listarPorId(reqId);

            return res.status(200).json(solicitacao);
        }
        catch(error){
            return res.status(404).json({ erro: error.message });
        }
    }

    atualizar(req,res){
        try{
            const id = req.params.id;
            const dados = req.body;

            const usuarioAtualizado = solicitacaoService.atualizar(id, dados);
            return res.status(200).json(usuarioAtualizado);
        }
        catch(error){
            return res.status(400).json({ error: error.message});
        }
    }

    alterar(req, res){
        try{
            const reqId = req.params.id;
            const dados = req.body;

            const solicitacaoAtualizada = solicitacaoService.alterar(reqId, dados);
            return res.status(200).json(solicitacaoAtualizada);
        }
        catch(error){  
            return res.status(400).json({error: error.message});
        }
    }

    deletar(req, res){
        try{
            const reqId = req.params.id;
            solicitacaoService.deletar(reqId);

            return res.status(204).send();
        }
        catch(error){
            res.status(400).json({ erro: error.message })
        }    
    }

};
export { SolicitacoesController };