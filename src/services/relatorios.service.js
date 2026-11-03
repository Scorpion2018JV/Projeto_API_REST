import { vendas } from '../data/dadosTeste.js';

export async function vendasPorPeriodo({ inicio, fim }) {
  let vendasRelatorio = vendas;

  if (inicio) {
    vendasRelatorio = vendasRelatorio.filter(v => new Date(v.data) >= new Date(inicio));
  }

  if (fim) {
    vendasRelatorio = vendasRelatorio.filter(v => new Date(v.data) <= new Date(fim));
  }

  return vendasRelatorio;
}