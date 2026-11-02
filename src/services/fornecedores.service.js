import { fornecedores, produtos, movimentacoes } from '../data/dadosTeste.js';
import { ErroDeAplicacao } from '../errors/ErroDeAplicacao.js';

let proximoIdForn = 4;

export async function listar() {
  return fornecedores;
}

export async function buscarPorId(id) {
  const buscaForn = fornecedores.find(f => f.id === Number(id));

  if (!buscaForn) {
    throw new ErroDeAplicacao(404, 'Fornecedor não encontrado.');
  }

  return buscaForn;
}

export async function criar(dados) {
  const novoFornecedor = {
    ...dados,
    id: proximoIdForn
  };

  proximoIdForn++;
  fornecedores.push(novoFornecedor);

  return novoFornecedor;
}

export async function atualizar(id, novosDados) {
  const fornAlteracao = fornecedores.find(f => f.id === Number(id));

  if (!fornAlteracao) {
    throw new ErroDeAplicacao(404, 'Fornecedor não encontrado.');
  }

  if (novosDados.nome !== undefined) {
    fornAlteracao.nome = novosDados.nome;
  }

  if (novosDados.telefone !== undefined) {
    fornAlteracao.telefone = novosDados.telefone;
  }

  if (novosDados.email !== undefined) {
    fornAlteracao.email = novosDados.email;
  }

  if (novosDados.ativo !== undefined) {
    fornAlteracao.ativo = novosDados.ativo;
  }

  return fornAlteracao;
}

export async function remover(id) {
  const indice = fornecedores.findIndex(f => f.id === Number(id));

  if (indice === -1) {
    throw new ErroDeAplicacao(404, 'Fornecedor não encontrado.');
  }

  const produtoVinculado = produtos.find(p => p.fornecedorId === Number(id));
  const movimentacaoVinculada = movimentacoes.find(m => m.fornecedorId === Number(id));

  if (produtoVinculado || movimentacaoVinculada) {
    throw new ErroDeAplicacao(409, 'Existem produtos ou movimentações vinculados a este fornecedor.');
  }

  const [fornDeletado] = fornecedores.splice(indice, 1);

  return fornDeletado;
}