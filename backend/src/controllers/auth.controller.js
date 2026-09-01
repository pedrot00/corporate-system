import AuthService from '../services/auth.service.js';

const authService = new AuthService();

export class AuthController {
  async login(req, res) {
    try {
      const { email, senha } = req.body;
      const resultado = await authService.login(email, senha);
      
      return res.status(200).json(resultado);
    } catch (error) {
      return res.status(401).json({ erro: error.message });
    }
  }

  me(req, res) {
    return res.status(200).json({ usuario: req.usuario });
  }
}