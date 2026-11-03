import * as service from '../services/movimentacoes.service.js';
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
    res.status(500).json({ error: 'Erro interno ao buscar a movimentação.' });
  }
}

export async function registrarEntrada(req, res) {
  try {
    const movimentacao = await service.registrarEntrada(req.body);
    res.status(201).json({
      message: 'Entrada de mercadoria registrada com sucesso.',
      movimentacao
    });
  } catch (error) {
    if (error instanceof ErroDeAplicacao) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error(error);
    res.status(500).json({ error: 'Erro interno ao registrar a entrada.' });
  }
}