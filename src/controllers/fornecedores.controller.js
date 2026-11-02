import * as service from '../services/fornecedores.service.js';
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
    res.status(500).json({ error: 'Erro interno ao buscar o fornecedor.' });
  }
}

export async function criar(req, res) {
  try {
    const novoFornecedor = await service.criar(req.body);
    res.status(201).json(novoFornecedor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno ao criar o fornecedor.' });
  }
}

export async function atualizar(req, res) {
  try {
    const fornecedor = await service.atualizar(req.params.id, req.body);
    res.status(200).json(fornecedor);
  } catch (error) {
    if (error instanceof ErroDeAplicacao) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error(error);
    res.status(500).json({ error: 'Erro interno ao atualizar o fornecedor.' });
  }
}

export async function remover(req, res) {
  try {
    const fornDeletado = await service.remover(req.params.id);
    res.status(200).json({ message: 'Fornecedor deletado com sucesso!', fornDeletado });
  } catch (error) {
    if (error instanceof ErroDeAplicacao) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error(error);
    res.status(500).json({ error: 'Erro interno ao deletar o fornecedor.' });
  }
}