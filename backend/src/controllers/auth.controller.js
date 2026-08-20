import AuthService from '../services/auth.service.js';

const authService = new AuthService();

export class AuthController {
    login(req, res, next) {
        try {
            const { email, senha } = req.body;
            const resultado = authService.login(email, senha);
            return res.status(200).json(resultado);

        } 
        catch (error) {
            next(error);
        }
    }

    me(req, res) {
        return res.status(200).json({ usuario: req.usuario });
    }
}