import * as service from '../services/estoque.service.js';

export async function listar(req, res) {
    res.status(200).json(await service.listar());
}

export async function baixo(req, res) {
    res.status(200).json(await service.baixo());
}