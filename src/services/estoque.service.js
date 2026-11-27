import * as produtosModel from '../models/produtos.models.js';

function apresentar(produto) {
  const { _id, ...dados } = produto;
  return { ...dados, id: _id.toString() };
}

export async function listar() {
  const produtos = await produtosModel.buscarTodas();
  return produtos.map(p => ({
    id: p._id.toString(),
    nome: p.nome,
    estoque: p.estoque,
    estoqueMinimo: p.estoqueMinimo
  }));
}

export async function baixo() {
  const produtos = await produtosModel.buscarTodas();
  return produtos
    .filter(p => p.estoque < p.estoqueMinimo)
    .map(apresentar);
}