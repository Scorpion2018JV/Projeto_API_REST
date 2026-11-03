import { produtos } from '../data/dadosTeste.js';

export async function listar() {
  return produtos.map(p => ({
    id: p.id,
    nome: p.nome,
    estoque: p.estoque,
    estoqueMinimo: p.estoqueMinimo
  }));
}

export async function baixo() {
  return produtos.filter(p => p.estoque < p.estoqueMinimo);
}