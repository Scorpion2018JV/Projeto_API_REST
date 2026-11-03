import * as service from '../services/relatorios.service.js';

export async function vendas(req, res) {
    res.status(200).json(await service.vendasPorPeriodo(req.query));
}