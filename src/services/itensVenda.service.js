import * as itensVendaModel from '../models/itensVendas.models.js';

function apresentar(item) {
  const { _id, ...dados } = item;
  return { ...dados, id: _id.toString() };
}

export async function listar() {
  const itens = await itensVendaModel.buscarTodas();
  return itens.map(apresentar);
}