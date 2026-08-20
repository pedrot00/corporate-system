import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_super_segura';

export function autenticarToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ mensagem: "Acesso negado. Token não fornecido." });
    }

    try {
        const usuarioDecodificado = jwt.verify(token, JWT_SECRET);
        req.usuario = usuarioDecodificado;
        next();
    } catch (error) {
        return res.status(403).json({ mensagem: "Token inválido ou expirado." });
    }
}

export function autorizarPerfis(...perfisPermitidos) {
    return (req, res, next) => {
        if (!req.usuario || !perfisPermitidos.includes(req.usuario.perfil)) {
            return res.status(403).json({ 
                mensagem: "Você não tem permissão para realizar esta ação." 
            });
        }
        next();
    };
}