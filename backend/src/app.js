import solicitacoesRouter from "./routers/solicitacoes.router.js";
import usuariosRouter from "./routers/usuarios.router.js"
import { manipuladorDeErros } from './middlewares/error.middleware.js';
import express from 'express';
import cors from 'cors'; 

const app = express();
app.use(cors());            // habilita acesso qlquer origem
app.use(express.json());

app.use("/usuarios", usuariosRouter);
app.use("/solicitacoes", solicitacoesRouter);
app.use(manipuladorDeErros);

const PORTA = 3000;
app.listen(PORTA, ()=>{
    console.log(`Servidor rodando na porta ${PORTA}`);
});
