export function manipuladorDeErros(err, req, res, next) {
    console.error(err.stack);

    const status = err.status || 400;
    return res.status(status).json({
        erro: err.message || "Ocorreu um erro interno no servidor."
    });
}