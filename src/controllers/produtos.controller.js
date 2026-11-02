import * as service from '../services/produtos.service.js';
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
    res.status(500).json({ error: 'Erro interno ao buscar o produto.' });
  }
}

export async function criar(req, res) {
  try {
    const novoProduto = await service.criar(req.body);
    res.status(201).json(novoProduto);
  } catch (error) {
    if (error instanceof ErroDeAplicacao) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error(error);
    res.status(500).json({ error: 'Erro interno ao criar o produto.' });
  }
}

export async function atualizar(req, res) {
  try {
    const produto = await service.atualizar(req.params.id, req.body);
    res.status(200).json(produto);
  } catch (error) {
    if (error instanceof ErroDeAplicacao) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error(error);
    res.status(500).json({ error: 'Erro interno ao atualizar o produto.' });
  }
}

export async function remover(req, res) {
  try {
    const prodDeletado = await service.remover(req.params.id);
    res.status(200).json({ message: 'Produto deletado com sucesso!', prodDeletado });
  } catch (error) {
    if (error instanceof ErroDeAplicacao) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error(error);
    res.status(500).json({ error: 'Erro interno ao deletar o produto.' });
  }
}