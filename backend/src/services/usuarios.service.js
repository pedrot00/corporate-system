import prisma from '../config/prisma.js';
import bcrypt from 'bcrypt';

class UsuariosService {

  async criarUsuario(dados) {
    if (!dados.nome || !dados.email || !dados.senha || !dados.departamento || !dados.perfil) {
      throw new Error("Preencha adequadamente todos os campos obrigatórios.");
    }

    const perfisPermitidos = ['FUNCIONARIO', 'GESTOR', 'COMPRAS', 'ADMIN'];
    if (!perfisPermitidos.includes(dados.perfil)) {
      throw new Error("Perfil inválido.");
    }

    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email: dados.email }
    });

    if (usuarioExistente) {
      throw new Error("E-mail já cadastrado no sistema.");
    }

    const senhaHash = await bcrypt.hash(dados.senha, 10);

    return await prisma.usuario.create({
      data: {
        nome: dados.nome,
        email: dados.email,
        senha: senhaHash,
        departamento: dados.departamento,
        perfil: dados.perfil
      },
      select: {
        id: true,
        nome: true,
        email: true,
        departamento: true,
        perfil: true,
        criadoEm: true
      }
    });
  }

  async listarUsuarios() {
    return await prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        departamento: true,
        perfil: true,
        criadoEm: true
      }
    });
  }

  async listarPorId(reqId) {
    const idNumerico = Number(reqId);
    const usuarioEncontrado = await prisma.usuario.findUnique({
      where: { id: idNumerico },
      select: {
        id: true,
        nome: true,
        email: true,
        departamento: true,
        perfil: true,
        criadoEm: true
      }
    });

    if (!usuarioEncontrado) {
      throw new Error("Usuário não encontrado.");
    }

    return usuarioEncontrado;
  }

  async atualizar(reqId, dados) {
    const idNumber = Number(reqId);
    await this.listarPorId(idNumber);

    if (!dados.nome || !dados.email || !dados.departamento || !dados.perfil) {
      throw new Error("Preencha adequadamente todos os campos obrigatórios.");
    }

    const perfisPermitidos = ['FUNCIONARIO', 'GESTOR', 'COMPRAS', 'ADMIN'];
    if (!perfisPermitidos.includes(dados.perfil)) {
      throw new Error("Perfil inválido.");
    }

    const dadosAtualizacao = {
      nome: dados.nome,
      email: dados.email,
      departamento: dados.departamento,
      perfil: dados.perfil
    };

    if (dados.senha) {
      dadosAtualizacao.senha = await bcrypt.hash(dados.senha, 10);
    }

    return await prisma.usuario.update({
      where: { id: idNumber },
      data: dadosAtualizacao,
      select: {
        id: true,
        nome: true,
        email: true,
        departamento: true,
        perfil: true
      }
    });
  }

  async alterar(reqId, dados) {
    const idNumber = Number(reqId);
    await this.listarPorId(idNumber);

    if (!dados.nome && !dados.email && !dados.departamento && !dados.perfil && !dados.senha) {
      throw new Error("Preencha adequadamente o campo a ser modificado.");
    }

    const dadosAtualizacao = {};

    if (dados.nome !== undefined) dadosAtualizacao.nome = dados.nome;
    if (dados.email !== undefined) dadosAtualizacao.email = dados.email;
    if (dados.departamento !== undefined) dadosAtualizacao.departamento = dados.departamento;

    if (dados.perfil !== undefined) {
      const perfisPermitidos = ['FUNCIONARIO', 'GESTOR', 'COMPRAS', 'ADMIN'];
      if (!perfisPermitidos.includes(dados.perfil)) {
        throw new Error("Perfil inválido.");
      }
      dadosAtualizacao.perfil = dados.perfil;
    }

    if (dados.senha !== undefined) {
      dadosAtualizacao.senha = await bcrypt.hash(dados.senha, 10);
    }

    return await prisma.usuario.update({
      where: { id: idNumber },
      data: dadosAtualizacao,
      select: {
        id: true,
        nome: true,
        email: true,
        departamento: true,
        perfil: true
      }
    });
  }

  // EXCLUSÃO COM VALIDAÇÃO DE AUTOEXCLUSÃO E SENHA
  async deletar(reqId, adminId, senhaAdmin) {
    const idNumber = Number(reqId);
    const adminIdNumber = Number(adminId);

    if (idNumber === adminIdNumber) {
      throw new Error("Você não pode excluir a sua própria conta de Administrador.");
    }

    if (!senhaAdmin) {
      throw new Error("Informe sua senha de administrador para confirmar a exclusão.");
    }

    const admin = await prisma.usuario.findUnique({
      where: { id: adminIdNumber }
    });

    if (!admin) {
      throw new Error("Administrador não autenticado.");
    }

    const senhaValida = await bcrypt.compare(senhaAdmin, admin.senha);
    if (!senhaValida) {
      throw new Error("Senha de confirmação incorreta.");
    }

    await this.listarPorId(idNumber);

    return await prisma.usuario.delete({
      where: { id: idNumber }
    });
  }
}

export default UsuariosService;