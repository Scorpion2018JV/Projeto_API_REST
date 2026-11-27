import * as produtosModel from '../models/produtos.models.js';
import * as fornecedoresModel from '../models/fornecedores.models.js';
import * as itensVendaModel from '../models/itensVendas.models.js';
import * as movimentacoesModel from '../models/movimentacoes.models.js';
import { ErroDeAplicacao } from '../errors/ErroDeAplicacao.js';

function apresentar(produto) {
  const { _id, ...dados } = produto;
  return { ...dados, id: _id.toString() };
}

export async function listar() {
  const produtos = await produtosModel.buscarTodas();
  return produtos.map(apresentar);
}

export async function buscarPorId(id) {
  const produto = await produtosModel.buscarPorId(id);
  if (!produto) {
    throw new ErroDeAplicacao(404, 'Produto não encontrado.');
  }

  return apresentar(produto);
}

export async function criar(dados) {
  if (dados.preco < 0) {
    throw new ErroDeAplicacao(400, 'O preço não pode ser negativo.');
  }

  const fornecedor = await fornecedoresModel.buscarPorId(dados.fornecedorId);
  if (!fornecedor) {
    throw new ErroDeAplicacao(400, 'O fornecedor indicado não existe.');
  }

  const dadosProduto = {};
  for (const campo of ['nome', 'descricao', 'preco', 'estoqueMinimo', 'ativo']) {
    if (dados[campo] !== undefined) dadosProduto[campo] = dados[campo];
  }
  dadosProduto.fornecedorId = fornecedor._id.toString();
  dadosProduto.estoque = 0;

  const idCriado = await produtosModel.inserir(dadosProduto);
  return buscarPorId(idCriado.toString());
}

export async function atualizar(id, novosDados) {
  const produto = await produtosModel.buscarPorId(id);
  if (!produto) {
    throw new ErroDeAplicacao(404, 'Produto não encontrado.');
  }

  if (novosDados.preco !== undefined && novosDados.preco < 0) {
    throw new ErroDeAplicacao(400, 'O preço não pode ser negativo.');
  }

  if (novosDados.fornecedorId !== undefined) {
    const fornecedor = await fornecedoresModel.buscarPorId(novosDados.fornecedorId);
    if (!fornecedor) {
      throw new ErroDeAplicacao(400, 'O fornecedor indicado não existe.');
    }
  }

  const campos = {};
  for (const campo of ['nome', 'descricao', 'preco', 'estoqueMinimo', 'ativo']) {
    if (novosDados[campo] !== undefined) campos[campo] = novosDados[campo];
  }
  if (novosDados.fornecedorId !== undefined) {
    campos.fornecedorId = novosDados.fornecedorId;
  }

  if (Object.keys(campos).length > 0) {
    await produtosModel.atualizar(id, campos);
  }
  return buscarPorId(id);
}

export async function remover(id) {
  const produto = await produtosModel.buscarPorId(id);
  if (!produto) {
    throw new ErroDeAplicacao(404, 'Produto não encontrado.');
  }

  const [itens, movimentacoes] = await Promise.all([
    itensVendaModel.buscarTodas(),
    movimentacoesModel.buscarTodas()
  ]);
  const idProduto = produto._id.toString();
  const possuiItem = itens.some(item => item.produtoId?.toString() === idProduto);
  const possuiMovimentacao = movimentacoes.some(mov => mov.produtoId?.toString() === idProduto);

  if (possuiItem || possuiMovimentacao) {
    throw new ErroDeAplicacao(
      409,
      'Não é possível excluir este produto, pois existem vendas ou movimentações vinculadas a ele.'
    );
  }

  await produtosModel.remover(id);
  return apresentar(produto);
}