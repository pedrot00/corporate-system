import DashboardService from "../services/dashboard.service.js";

const dashboardService = new DashboardService();

class DashboardController{
    listar(req, res){
        try{   
            const { dataInicio, dataFinal, departamento } = req.query;

            const informacoes = dashboardService.listarInformacoes({
                dataInicio,
                dataFinal,
                departamento
            });
            return res.status(200).json(informacoes);
        }
        catch(error){
            return res.status(400).json({ error: error.message })
        }
    }
}
export { DashboardController };