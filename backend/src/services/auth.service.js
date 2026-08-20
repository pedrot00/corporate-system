import jwt from "jsonwebtoken";
import usuarios from "../models/usuariosModel.js";

const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_super_segura';

class AuthService {
    login(email, senha) {
        if (!email || !senha) {
            throw new Error("Email e senha são obrigatórios.");
        }

        const usuario = usuarios.find(u => 
            (u.email && u.email === email) || (u.nome.toLowerCase() === email.toLowerCase())
        );

        if (!usuario) {
            throw new Error("Credenciais inválidas.");
        }

        if (senha !== '123456') {
            throw new Error("Credenciais inválidas.");
        }

        const token = jwt.sign(
            { 
                id: usuario.id, 
                nome: usuario.nome, 
                departamento: usuario.departamento, 
                perfil: usuario.perfil 
            },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        return {
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                departamento: usuario.departamento,
                perfil: usuario.perfil
            }
        };
    }
}

export default AuthService;