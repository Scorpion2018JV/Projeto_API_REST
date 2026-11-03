import * as service from '../services/vendas.service.js';
import { ErroDeAplicacao } from '../errors/ErroDeAplicacao.js';

export async function listar(req, res) {
    res.status(200).json(await service.listar());
}

export async function buscarPorId(req, res) {
  try {
    res.status(200).json(await service.buscarPorId(req.params.id));
  } catch (error) {
    if (error instanceof ErroDeAplicacao) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error(error);
    res.status(500).json({ error: 'Erro interno ao buscar a venda.' });
  }
}

export async function criar(req, res) {
  try {
    const resultado = await service.criar(req.body);
    res.status(201).json(resultado);
  } catch (error) {
    if (error instanceof ErroDeAplicacao) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error(error);
    res.status(500).json({ error: 'Erro interno ao criar a venda.' });
  }
}

export async function cancelar(req, res) {
  try {
    const resultado = await service.cancelar(req.params.id, req.body);
    res.status(200).json(resultado);
  } catch (error) {
    if (error instanceof ErroDeAplicacao) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error(error);
    res.status(500).json({ error: 'Erro interno ao cancelar a venda.' });
  }
}