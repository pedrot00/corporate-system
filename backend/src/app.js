import solicitacoesRouter from "./routers/solicitacoes.router.js";
import usuariosRouter from "./routers/usuarios.router.js";
import dashboardRouter from "./routers/dashboard.router.js";
import authRouter from "./routers/auth.router.js"
import { manipuladorDeErros } from './middlewares/error.middleware.js';
import express from 'express';
import cors from 'cors'; 

const app = express();
app.use(cors());           
app.use(express.json());

app.use('/auth', authRouter);
app.use("/usuarios", usuariosRouter);
app.use("/solicitacoes", solicitacoesRouter);
app.use("/dashboard", dashboardRouter);
app.use(manipuladorDeErros);

const PORTA = 3000;
app.listen(PORTA, ()=>{
    console.log(`Servidor rodando na porta ${PORTA}`);
});
