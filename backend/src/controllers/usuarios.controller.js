import UsuariosService from "../services/usuarios.service.js";

const usuariosService = new UsuariosService();
class UsuariosController{

    criar(req, res){
        try{
            const dadosUsuario = req.body;
            const novoUsuario = usuariosService.criarUsuario(dadosUsuario)

            return res.status(201).json(novoUsuario)
        }
        catch(erro){
            return res.status(400).json({ erro: erro.message});
        }
    }

    listar(req, res){
        try{
            const listaUsuarios = usuariosService.listarUsuarios();
            return res.status(200).json(listaUsuarios);
        }
        catch(error){
            return res.status(400).json({ erro: error.message});
        }
    }

    listarPorId(req, res){
        try{
            const reqId = req.params.id;
            const usuario = usuariosService.listarPorId(reqId);

            return res.status(200).json(usuario);
        } catch(error){
            return res.status(400).json({ error: 'usuário não encontrado.'});
        }
    }

    atualizar(req, res){
        try{
            const reqId = req.params.id;
            const dados = req.body;

            const usuarioAtualizado = usuariosService.atualizar(reqId, dados);
            return res.status(200).json(usuarioAtualizado);
        }
        catch(error){
            return res.status(400).json({ erro: error.message});
        }
    }

    alterar(req, res){
       try{
            const reqId = req.params.id;
            const dados = req.body;

            const usuarioAtualizado = usuariosService.alterar(reqId, dados);
            return res.status(200).json(usuarioAtualizado);
        }
        catch(error){
            return res.status(400).json({ erro: error.message});
        }
    }

    deletar(req, res){
        try{
            const reqId = req.params.id;
            usuariosService.deletar(reqId);

            return res.status(204).send();
        }
        catch(error){
            res.status(400).json({ erro: error.message })
        }
        
    }
};
export { UsuariosController };