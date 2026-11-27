import * as vendasModel from '../models/vendas.models.js';
import * as itensVendaModel from '../models/itensVendas.models.js';
import * as produtosModel from '../models/produtos.models.js';
import * as movimentacoesModel from '../models/movimentacoes.models.js';
import { ErroDeAplicacao } from '../errors/ErroDeAplicacao.js';

function apresentar(documento) {
  const { _id, ...dados } = documento;
  return { ...dados, id: _id.toString() };
}

function mesmoDia(dataA, dataB) {
  return (
    dataA.getFullYear() === dataB.getFullYear() &&
    dataA.getMonth() === dataB.getMonth() &&
    dataA.getDate() === dataB.getDate()
  );
}

async function buscarItensBrutos(vendaId) {
  const todos = await itensVendaModel.buscarTodas();
  return todos.filter(item => item.vendaId?.toString() === vendaId);
}

async function buscarItens(vendaId) {
  const itens = await buscarItensBrutos(vendaId);
  return itens.map(apresentar);
}

async function registrarMovimentacao({ produtoId, tipo, quantidade, data, vendaId, motivo }) {
  await movimentacoesModel.inserir({
    produtoId,
    tipo,
    quantidade,
    data,
    fornecedorId: null,
    vendaId,
    motivo
  });
}

async function montarVenda(vendaId) {
  const venda = await vendasModel.buscarPorId(vendaId);
  return {
    venda: apresentar(venda),
    itens: await buscarItens(vendaId)
  };
}

async function validarItens(itens, itensOriginais = []) {
  if (!Array.isArray(itens) || itens.length === 0) {
    throw new ErroDeAplicacao(400, 'A nova venda precisa ter pelo menos um produto.');
  }

  let valorTotal = 0;
  const produtosInformados = new Set();

  for (const item of itens) {
    const produto = await produtosModel.buscarPorId(item.produtoId);
    if (!produto) {
      throw new ErroDeAplicacao(404, `O produto com identificação ${item.produtoId} não foi encontrado.`);
    }

    if (!produto.ativo) {
      throw new ErroDeAplicacao(400, 'O produto está inativo.');
    }

    if (!Number.isInteger(item.quantidade) || item.quantidade <= 0) {
      throw new ErroDeAplicacao(400, 'A quantidade deve ser um número inteiro maior que zero.');
    }

    const idProduto = produto._id.toString();
    if (produtosInformados.has(idProduto)) {
      throw new ErroDeAplicacao(400, `O produto ${produto.nome} foi informado mais de uma vez.`);
    }
    produtosInformados.add(idProduto);

    let estoqueDisponivel = produto.estoque;
    for (const original of itensOriginais) {
      if (original.produtoId?.toString() === idProduto) {
        estoqueDisponivel += original.quantidade;
      }
    }

    if (estoqueDisponivel < item.quantidade) {
      throw new ErroDeAplicacao(400, 'Estoque insuficiente para o produto ' + produto.nome);
    }

    valorTotal += produto.preco * item.quantidade;
  }

  return Number(valorTotal.toFixed(2));
}

async function registrarVenda(itens, valorTotal, motivoMovimentacao) {
  const data = new Date().toISOString();

  const idCriado = await vendasModel.inserir({
    data,
    valorTotal,
    status: 'finalizada',
    dataCancelamento: null,
    motivoCancelamento: null,
    vendaSubstitutaId: null
  });
  const vendaId = idCriado.toString();

  for (const item of itens) {
    const produto = await produtosModel.buscarPorId(item.produtoId);
    const produtoId = produto._id.toString();

    await itensVendaModel.inserir({
      vendaId,
      produtoId,
      nomeProduto: produto.nome,
      quantidade: item.quantidade,
      precoUnitario: produto.preco,
      subtotal: Number((produto.preco * item.quantidade).toFixed(2))
    });

    await produtosModel.atualizar(produtoId, { estoque: produto.estoque - item.quantidade });

    await registrarMovimentacao({
      produtoId,
      tipo: 'saida',
      quantidade: item.quantidade,
      data,
      vendaId,
      motivo: motivoMovimentacao
    });
  }

  return vendaId;
}

export async function listar() {
  const vendas = await vendasModel.buscarTodas();
  return vendas.map(apresentar);
}

export async function buscarPorId(id) {
  const venda = await vendasModel.buscarPorId(id);
  if (!venda) {
    throw new ErroDeAplicacao(404, 'Venda não encontrada.');
  }

  return montarVenda(id);
}

export async function criar({ itens } = {}) {
  const valorTotal = await validarItens(itens);
  const vendaId = await registrarVenda(itens, valorTotal, 'Venda');

  return montarVenda(vendaId);
}

export async function cancelar(id, { motivoCancelamento, itens } = {}) {
  const venda = await vendasModel.buscarPorId(id);
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

  const vendaId = venda._id.toString();
  const itensOriginais = await buscarItensBrutos(vendaId);
  const vaiCriarVendaCorrigida = itens !== undefined;

  let valorTotalNovaVenda = 0;
  if (vaiCriarVendaCorrigida) {
    valorTotalNovaVenda = await validarItens(itens, itensOriginais);
  }

  const dataCancelamento = new Date().toISOString();

  for (const item of itensOriginais) {
    const produto = await produtosModel.buscarPorId(item.produtoId);
    const produtoId = produto._id.toString();

    await produtosModel.atualizar(produtoId, { estoque: produto.estoque + item.quantidade });

    await registrarMovimentacao({
      produtoId,
      tipo: 'entrada',
      quantidade: item.quantidade,
      data: dataCancelamento,
      vendaId,
      motivo: 'Cancelamento de venda'
    });
  }

  await vendasModel.atualizar(vendaId, {
    status: 'cancelada',
    dataCancelamento,
    motivoCancelamento
  });

  if (!vaiCriarVendaCorrigida) {
    const vendaCancelada = await vendasModel.buscarPorId(vendaId);
    return {
      message: 'Venda cancelada com sucesso.',
      vendaCancelada: apresentar(vendaCancelada)
    };
  }

  const novaVendaId = await registrarVenda(itens, valorTotalNovaVenda, 'Venda corrigida');
  await vendasModel.atualizar(vendaId, { vendaSubstitutaId: novaVendaId });

  const vendaCancelada = await vendasModel.buscarPorId(vendaId);
  const novaVenda = await montarVenda(novaVendaId);

  return {
    message: 'Venda cancelada e nova venda corrigida criada com sucesso.',
    vendaCancelada: apresentar(vendaCancelada),
    novaVenda: novaVenda.venda,
    itensNovaVenda: novaVenda.itens
  };
}