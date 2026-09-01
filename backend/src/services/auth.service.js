import prisma from '../config/prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default class AuthService {
  async login(email, senha) {
    // 1. Busca o usuário no PostgreSQL
    const usuario = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario) {
      throw new Error('Credenciais inválidas.');
    }

    // 2. Valida a senha contra o hash criptografado
    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      throw new Error('Credenciais inválidas.');
    }

    // 3. Gera o token JWT com os dados reais
    const token = jwt.sign(
      {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil,
        departamento: usuario.departamento,
      },
      process.env.JWT_SECRET || 'chave_secreta_padrao',
      { expiresIn: '8h' }
    );

    // Omitir a senha do retorno por segurança
    const { senha: _, ...usuarioSemSenha } = usuario;

    return {
      usuario: usuarioSemSenha,
      token,
    };
  }
}