import { produtos, fornecedores, movimentacoes } from '../data/dadosTeste.js';
import { ErroDeAplicacao } from '../errors/ErroDeAplicacao.js';

let proximoIdMov = 20;

export async function listar() {
  return movimentacoes;
}

export async function buscarPorId(id) {
  const buscaMov = movimentacoes.find(m => m.id === Number(id));

  if (!buscaMov) {
    throw new ErroDeAplicacao(404, 'Movimentação não encontrada');
  }

  return buscaMov;
}

export function registrar({
  produtoId,
  tipo,
  quantidade,
  data = new Date().toISOString(),
  fornecedorId = null,
  vendaId = null,
  motivo
}) {
  const novaMovimentacao = {
    id: proximoIdMov,
    produtoId,
    tipo,
    quantidade,
    data,
    fornecedorId,
    vendaId,
    motivo
  };

  proximoIdMov++;
  movimentacoes.push(novaMovimentacao);

  return novaMovimentacao;
}

export async function registrarEntrada({ produtoId, quantidade, fornecedorId, motivo }) {
  const buscaProduto = produtos.find(p => p.id === Number(produtoId));

  if (!buscaProduto) {
    throw new ErroDeAplicacao(404, 'Produto não encontrado.');
  }

  const buscaForn = fornecedores.find(f => f.id === Number(fornecedorId));

  if (!buscaForn) {
    throw new ErroDeAplicacao(404, 'Fornecedor não encontrado');
  }

  if (!Number.isInteger(quantidade) || quantidade <= 0) {
    throw new ErroDeAplicacao(400, 'A quantidade deve ser um número inteiro maior que zero.');
  }

  if (!motivo) {
    throw new ErroDeAplicacao(400, 'Informe o motivo da entrada.');
  }

  buscaProduto.estoque += quantidade;

  return registrar({
    produtoId: buscaProduto.id,
    tipo: 'entrada',
    quantidade,
    fornecedorId: buscaForn.id,
    vendaId: null,
    motivo
  });
}