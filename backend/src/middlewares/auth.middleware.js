export function autenticar(req, res, next) {
    const usuarioNome = req.headers['x-usuario-nome'];
    const usuarioPerfil = req.headers['x-usuario-perfil']; // Ex: 'SOLICITANTE', 'GESTOR', 'COMPRAS'

    if (!usuarioNome) {
        return res.status(401).json({ erro: "Usuário não identificado nos headers da requisição." });
    }

    req.usuarioLogado = {
        nome: usuarioNome,
        perfil: usuarioPerfil || 'SOLICITANTE'
    };
    
    next(); 
}