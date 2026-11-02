import { produtos, fornecedores, itensVenda, movimentacoes } from '../data/dadosTeste.js';
import { ErroDeAplicacao } from '../errors/ErroDeAplicacao.js';

let proximoIdProd = 6;

export async function listar() {
  return produtos;
}

export async function buscarPorId(id) {
  const buscaProd = produtos.find(p => p.id === Number(id));

  if (!buscaProd) {
    throw new ErroDeAplicacao(404, 'Produto não encontrado.');
  }

  return buscaProd;
}

export async function criar(dados) {
  if (dados.preco < 0) {
    throw new ErroDeAplicacao(400, 'O preço não pode ser negativo.');
  }

  const existeFornecedor = fornecedores.find(f => f.id === Number(dados.fornecedorId));

  if (!existeFornecedor) {
    throw new ErroDeAplicacao(400, 'O fornecedor indicado não existe.');
  }

  const novoProduto = {
    ...dados,
    fornecedorId: Number(dados.fornecedorId),
    id: proximoIdProd,
    estoque: 0
  };

  proximoIdProd++;
  produtos.push(novoProduto);

  return novoProduto;
}

export async function atualizar(id, novosDados) {
  const prodAlteracao = produtos.find(p => p.id === Number(id));

  if (!prodAlteracao) {
    throw new ErroDeAplicacao(404, 'Produto não encontrado.');
  }

  if (novosDados.preco !== undefined && novosDados.preco < 0) {
    throw new ErroDeAplicacao(400, 'O preço não pode ser negativo.');
  }

  if (novosDados.fornecedorId !== undefined) {
    const existeFornecedor = fornecedores.find(f => f.id === Number(novosDados.fornecedorId));

    if (!existeFornecedor) {
      throw new ErroDeAplicacao(400, 'O fornecedor indicado não existe.');
    }
  }

  if (novosDados.nome !== undefined) {
    prodAlteracao.nome = novosDados.nome;
  }

  if (novosDados.descricao !== undefined) {
    prodAlteracao.descricao = novosDados.descricao;
  }

  if (novosDados.preco !== undefined) {
    prodAlteracao.preco = novosDados.preco;
  }

  if (novosDados.estoqueMinimo !== undefined) {
    prodAlteracao.estoqueMinimo = novosDados.estoqueMinimo;
  }

  if (novosDados.fornecedorId !== undefined) {
    prodAlteracao.fornecedorId = Number(novosDados.fornecedorId);
  }

  if (novosDados.ativo !== undefined) {
    prodAlteracao.ativo = novosDados.ativo;
  }

  return prodAlteracao;
}

export async function remover(id) {
  const indice = produtos.findIndex(p => p.id === Number(id));

  if (indice === -1) {
    throw new ErroDeAplicacao(404, 'Produto não encontrado.');
  }

  const itemVinculado = itensVenda.find(item => item.produtoId === Number(id));
  const movimentacaoVinculada = movimentacoes.find(mov => mov.produtoId === Number(id));

  if (itemVinculado || movimentacaoVinculada) {
    throw new ErroDeAplicacao(
      409,
      'Não é possível excluir este produto, pois existem vendas ou movimentações vinculadas a ele.'
    );
  }

  const [prodDeletado] = produtos.splice(indice, 1);

  return prodDeletado;
}