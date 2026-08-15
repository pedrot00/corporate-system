import usuarios from "../models/usuariosModel.js";

class UsuariosService {

    criarUsuario(dados){
        if (!dados.nome || !dados.departamento || !dados.perfil){
            throw new Error("Preencha adequadamente todos os campos obrigatórios.");
        }
        const novoUsuario = {
            id: usuarios.length + 1,
            nome: dados.nome,
            departamento: dados.departamento,
            perfil: dados.perfil
        };
        try {
            usuarios.push(novoUsuario);

            return novoUsuario;
        } catch (error) {
            throw new Error("Não foi possível cadastrar o novo usuário.");
        }
    }
    
    listarUsuarios(dados){
        return usuarios;
    }

    listarPorId(reqId){
        const idNumerico = Number(reqId);
        const usuarioEncontrado = usuarios.find((usuario => usuario.id === idNumerico))

        if(!usuarioEncontrado){
            throw new Error("Usuário não encontrado");
        }
        return usuarioEncontrado;
    }

    atualizar(reqId, dados){
        const idNumber = Number(reqId);
        const usuarioEncontrado = usuarios.find(usuario => usuario.id === idNumber);

        if(!usuarioEncontrado){
            throw new Error("Usuário não encontrado para atualização");
        }
        if (!dados.nome || !dados.departamento || !dados.perfil){
            throw new Error("Preencha adequadamente todos os campos obrigatórios.");
        }

        usuarioEncontrado.nome = dados.nome;
        usuarioEncontrado.departamento = dados.departamento;
        usuarioEncontrado.perfil = dados.perfil;

        //n precisamos dar push no banco pois o usuario ja esta la
        return usuarioEncontrado;
    }

    alterar(reqId, dados){
         const idNumber = Number(reqId);
         const usuarioEncontrado = usuarios.find(usuario => usuario.id === idNumber);

        if(!usuarioEncontrado){
            throw new Error("Usuário não encontrado para atualização");
        }
        if (!dados.nome && !dados.departamento && !dados.perfil){
            throw new Error("Preencha adequadamente o campo a ser modificado.");
        }

        if(dados.nome !== undefined){
            usuarioEncontrado.nome = dados.nome;
        }
        if(dados.departamento !== undefined){
            usuarioEncontrado.departamento = dados.departamento;
        }
         if(dados.perfil !== undefined){
            const perfisPermitidos = ['FUNCIONARIO', 'GESTOR', 'COMPRAS', 'ADMIN'];
            if (!perfisPermitidos.includes(dados.perfil)) {
                throw new Error("Perfil inválido.");
            }
            usuarioEncontrado.perfil = dados.perfil
        }
        return usuarioEncontrado;
    }

    deletar(reqId){
        const idNumber = Number(reqId);
        const index = usuarios.findIndex(usuario => usuario.id === idNumber);
        
        if(index == -1){
            throw new Error('Usuário não encontrado para deleção.');
        }

        usuarios.splice(index,1);
    }
}

export default UsuariosService;