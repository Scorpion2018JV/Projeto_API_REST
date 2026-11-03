import * as service from '../services/itensVenda.service.js';

export async function listar(req, res) {
    res.status(200).json(await service.listar());
}