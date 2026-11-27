import * as fornecedoresModel from '../models/fornecedores.models.js';
import * as produtosModel from '../models/produtos.models.js';
import * as movimentacoesModel from '../models/movimentacoes.models.js';
import { ErroDeAplicacao } from '../errors/ErroDeAplicacao.js';

function apresentar(fornecedor) {
  const { _id, ...dados } = fornecedor;
  return { ...dados, id: _id.toString() };
}

export async function listar() {
  const fornecedores = await fornecedoresModel.buscarTodas();
  return fornecedores.map(apresentar);
}

export async function buscarPorId(id) {
  const fornecedor = await fornecedoresModel.buscarPorId(id);
  if (!fornecedor) {
    throw new ErroDeAplicacao(404, 'Fornecedor não encontrado.');
  }

  return apresentar(fornecedor);
}

export async function criar(dados) {
  const dadosFornecedor = {};
  for (const campo of ['nome', 'cnpj', 'telefone', 'email', 'ativo']) {
    if (dados[campo] !== undefined) dadosFornecedor[campo] = dados[campo];
  }
  const idCriado = await fornecedoresModel.inserir(dadosFornecedor);
  return buscarPorId(idCriado.toString());
}

export async function atualizar(id, novosDados) {
  const fornecedor = await fornecedoresModel.buscarPorId(id);
  if (!fornecedor) {
    throw new ErroDeAplicacao(404, 'Fornecedor não encontrado.');
  }

  const campos = {};
  for (const campo of ['nome', 'telefone', 'email', 'ativo']) {
    if (novosDados[campo] !== undefined) campos[campo] = novosDados[campo];
  }

  if (Object.keys(campos).length > 0) {
    await fornecedoresModel.atualizar(id, campos);
  }
  return buscarPorId(id);
}

export async function remover(id) {
  const fornecedor = await fornecedoresModel.buscarPorId(id);
  if (!fornecedor) {
    throw new ErroDeAplicacao(404, 'Fornecedor não encontrado.');
  }

  const [produtos, movimentacoes] = await Promise.all([
    produtosModel.buscarTodas(),
    movimentacoesModel.buscarTodas()
  ]);
  const idFornecedor = fornecedor._id.toString();
  const possuiProduto = produtos.some(produto => produto.fornecedorId?.toString() === idFornecedor);
  const possuiMovimentacao = movimentacoes.some(
    movimentacao => movimentacao.fornecedorId?.toString() === idFornecedor
  );

  if (possuiProduto || possuiMovimentacao) {
    throw new ErroDeAplicacao(409, 'Existem produtos ou movimentações vinculados a este fornecedor.');
  }

  await fornecedoresModel.remover(id);
  return apresentar(fornecedor);
}