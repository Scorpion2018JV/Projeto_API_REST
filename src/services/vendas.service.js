import { produtos, vendas, itensVenda } from '../data/dadosTeste.js';
import { ErroDeAplicacao } from '../errors/ErroDeAplicacao.js';
import * as movimentacoesService from './movimentacoes.service.js';

let proximoIdVenda = 5;
let proximoIdItem = 12;

function mesmoDia(dataA, dataB) {
  return (
    dataA.getFullYear() === dataB.getFullYear() &&
    dataA.getMonth() === dataB.getMonth() &&
    dataA.getDate() === dataB.getDate()
  );
}

function validarItens(itens, itensOriginais = []) {
  if (!Array.isArray(itens) || itens.length === 0) {
    throw new ErroDeAplicacao(400, 'A nova venda precisa ter pelo menos um produto.');
  }

  let valorTotal = 0;

  for (let i = 0; i < itens.length; i++) {
    const produto = produtos.find(p => p.id === Number(itens[i].produtoId));

    if (!produto) {
      throw new ErroDeAplicacao(404, `O produto com identificação ${itens[i].produtoId} não foi encontrado.`);
    }

    if (!produto.ativo) {
      throw new ErroDeAplicacao(400, 'O produto está inativo.');
    }

    const quantidade = itens[i].quantidade;

    if (!Number.isInteger(quantidade) || quantidade <= 0) {
      throw new ErroDeAplicacao(400, 'A quantidade deve ser um número inteiro maior que zero.');
    }

    for (let j = 0; j < i; j++) {
      if (Number(itens[j].produtoId) === produto.id) {
        throw new ErroDeAplicacao(400, `O produto ${produto.nome} foi informado mais de uma vez.`);
      }
    }

    let estoqueDisponivel = produto.estoque;

    for (let j = 0; j < itensOriginais.length; j++) {
      if (itensOriginais[j].produtoId === produto.id) {
        estoqueDisponivel += itensOriginais[j].quantidade;
      }
    }

    if (estoqueDisponivel < quantidade) {
      throw new ErroDeAplicacao(400, 'Estoque insuficiente para o produto ' + produto.nome);
    }

    valorTotal += produto.preco * quantidade;
  }

  return Number(valorTotal.toFixed(2));
}

function registrarVenda(itens, valorTotal, motivoMovimentacao) {
  const novaVenda = {
    id: proximoIdVenda,
    data: new Date().toISOString(),
    valorTotal: valorTotal,
    status: 'finalizada',
    dataCancelamento: null,
    motivoCancelamento: null,
    vendaSubstitutaId: null
  };
  proximoIdVenda++;
  vendas.push(novaVenda);

  for (let i = 0; i < itens.length; i++) {
    const produto = produtos.find(p => p.id === Number(itens[i].produtoId));

    const quantidade = itens[i].quantidade;
    const subtotal = Number((produto.preco * quantidade).toFixed(2));

    const novoItem = {
      id: proximoIdItem,
      vendaId: novaVenda.id,
      produtoId: produto.id,
      nomeProduto: produto.nome,
      quantidade: quantidade,
      precoUnitario: produto.preco,
      subtotal: subtotal
    };
    proximoIdItem++;
    itensVenda.push(novoItem);

    produto.estoque -= quantidade;

    movimentacoesService.registrar({
      produtoId: produto.id,
      tipo: 'saida',
      quantidade: quantidade,
      data: novaVenda.data,
      fornecedorId: null,
      vendaId: novaVenda.id,
      motivo: motivoMovimentacao
    });
  }

  return novaVenda;
}

export async function listar() {
  return vendas;
}

export async function buscarPorId(id) {
  const buscaVenda = vendas.find(venda => venda.id === Number(id));

  if (!buscaVenda) {
    throw new ErroDeAplicacao(404, 'Venda não encontrada.');
  }

  const buscaItens = itensVenda.filter(item => item.vendaId === buscaVenda.id);

  return { venda: buscaVenda, itens: buscaItens };
}

export async function criar({ itens }) {
  const valorTotal = validarItens(itens);
  const novaVenda = registrarVenda(itens, valorTotal, 'Venda');

  return {
    venda: novaVenda,
    itens: itensVenda.filter(item => item.vendaId === novaVenda.id)
  };
}

export async function cancelar(id, { motivoCancelamento, itens } = {}) {
  const venda = vendas.find(v => v.id === Number(id));

  if (!venda) {
    throw new ErroDeAplicacao(404, 'Venda não encontrada.');
  }

  if (venda.status === 'cancelada') {
    throw new ErroDeAplicacao(400, 'Esta venda já foi cancelada.');
  }

  if (!mesmoDia(new Date(), new Date(venda.data))) {
    throw new ErroDeAplicacao(400, 'Uma venda só pode ser cancelada no mesmo dia em que foi realizada.');
  }

  if (!motivoCancelamento) {
    throw new ErroDeAplicacao(400, 'Informe o motivo do cancelamento.');
  }

  const itensOriginais = itensVenda.filter(item => item.vendaId === venda.id);
  const vaiCriarVendaCorrigida = itens !== undefined;

  let valorTotalNovaVenda = 0;

  if (vaiCriarVendaCorrigida) {
    valorTotalNovaVenda = validarItens(itens, itensOriginais);
  }

  const dataCancelamento = new Date().toISOString();

  for (let i = 0; i < itensOriginais.length; i++) {
    const item = itensOriginais[i];
    const produto = produtos.find(p => p.id === item.produtoId);

    produto.estoque += item.quantidade;

    movimentacoesService.registrar({
      produtoId: produto.id,
      tipo: 'entrada',
      quantidade: item.quantidade,
      data: dataCancelamento,
      fornecedorId: null,
      vendaId: venda.id,
      motivo: 'Cancelamento de venda'
    });
  }

  venda.status = 'cancelada';
  venda.dataCancelamento = dataCancelamento;
  venda.motivoCancelamento = motivoCancelamento;

  if (!vaiCriarVendaCorrigida) {
    return {
      message: 'Venda cancelada com sucesso.',
      vendaCancelada: venda
    };
  }

  const novaVenda = registrarVenda(itens, valorTotalNovaVenda, 'Venda corrigida');
  venda.vendaSubstitutaId = novaVenda.id;

  return {
    message: 'Venda cancelada e nova venda corrigida criada com sucesso.',
    vendaCancelada: venda,
    novaVenda: novaVenda,
    itensNovaVenda: itensVenda.filter(item => item.vendaId === novaVenda.id)
  };
}