import * as vendasModel from '../models/vendas.models.js';

function apresentar(venda) {
  const { _id, ...dados } = venda;
  return { ...dados, id: _id.toString() };
}

export async function vendasPorPeriodo({ inicio, fim }) {
  const vendas = await vendasModel.buscarTodas();
  let vendasRelatorio = vendas;

  if (inicio) {
    vendasRelatorio = vendasRelatorio.filter(v => new Date(v.data) >= new Date(inicio));
  }

  if (fim) {
    vendasRelatorio = vendasRelatorio.filter(v => new Date(v.data) <= new Date(fim));
  }

  return vendasRelatorio.map(apresentar);
}