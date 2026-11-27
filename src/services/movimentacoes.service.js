import * as movimentacoesModel from '../models/movimentacoes.models.js';
import * as produtosModel from '../models/produtos.models.js';
import * as fornecedoresModel from '../models/fornecedores.models.js';
import { ErroDeAplicacao } from '../errors/ErroDeAplicacao.js';

function apresentar(movimentacao) {
  const { _id, ...dados } = movimentacao;
  return { ...dados, id: _id.toString() };
}

export async function listar() {
  const movimentacoes = await movimentacoesModel.buscarTodas();
  return movimentacoes.map(apresentar);
}

export async function buscarPorId(id) {
  const movimentacao = await movimentacoesModel.buscarPorId(id);
  if (!movimentacao) {
    throw new ErroDeAplicacao(404, 'Movimentação não encontrada.');
  }

  return apresentar(movimentacao);
}

export async function registrarEntrada({ produtoId, quantidade, fornecedorId, motivo }) {
  const produto = await produtosModel.buscarPorId(produtoId);
  if (!produto) {
    throw new ErroDeAplicacao(404, 'Produto não encontrado.');
  }

  const fornecedor = await fornecedoresModel.buscarPorId(fornecedorId);
  if (!fornecedor) {
    throw new ErroDeAplicacao(404, 'Fornecedor não encontrado.');
  }

  if (!Number.isInteger(quantidade) || quantidade <= 0) {
    throw new ErroDeAplicacao(400, 'A quantidade deve ser um número inteiro maior que zero.');
  }

  if (!motivo) {
    throw new ErroDeAplicacao(400, 'Informe o motivo da entrada.');
  }

  const idProduto = produto._id.toString();
  await produtosModel.atualizar(idProduto, { estoque: produto.estoque + quantidade });

  const idCriado = await movimentacoesModel.inserir({
    produtoId: idProduto,
    tipo: 'entrada',
    quantidade,
    data: new Date().toISOString(),
    fornecedorId: fornecedor._id.toString(),
    vendaId: null,
    motivo
  });

  return buscarPorId(idCriado.toString());
}