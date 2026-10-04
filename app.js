import express from 'express'
const app = express();
app.use(express.json());

import { produtos, fornecedores, vendas, itensVenda, movimentacoes } from "./dadosTeste.js";

const PORT = 3000;

let proximoIdProd = 6;

app.get ('/', (req, res) => {
    res.status(200).send('API de gerenciamento de vendas e produtos ar');
});

app.get ('/produtos', (req, res) => {
    res.status(200).json(produtos);
});

app.get ('/produtos/:id', (req, res) => {
    const { id } = req.params;
    const buscaProd = produtos.find( p => p.id === Number(id));

    if (!buscaProd) {
        return res.status(404).json({error: "Produto não encontrado."});
    };

    res.status(200).json(buscaProd);
});

app.post ('/produtos', (req, res) => {
    const novoProduto = {
        ...req.body,
        id: proximoIdProd,
        estoque: 0
    };

    proximoIdProd++;
    produtos.push(novoProduto);

    return res.status(201).json(novoProduto);
});

app.delete ('/produtos/:id', (req, res) => {
    const { id } = req.params;
    const indice = produtos.findIndex( p => p.id === Number(id));

    if (indice === -1){
        return res.status(404).json({error: "Produto não encontrado."});
    };

    const [prodDeletado] = produtos.splice(indice, 1);

    return res.status(200).json({message: "Produto deletado com sucesso!", prodDeletado});
});

app.patch ('/produtos/:id', (req, res) => {
    const { id } = req.params;
    const prodAlteracao = produtos.find( p => p.id === Number(id));

    if (!prodAlteracao){
        return res.status(404).json({error: "Produto não encontrado."});
    };

    const novosDados = req.body;

    if (novosDados.nome !== undefined) {
        prodAlteracao.nome = novosDados.nome;
    };

    if (novosDados.descricao !== undefined) {
        prodAlteracao.descricao = novosDados.descricao;
    };

    if (novosDados.preco !== undefined) {
        prodAlteracao.preco = novosDados.preco;
    };

    if (novosDados.estoqueMinimo !== undefined) {
        prodAlteracao.estoqueMinimo = novosDados.estoqueMinimo;
    };

    if (novosDados.fornecedorId !== undefined) {
        prodAlteracao.fornecedorId = novosDados.fornecedorId;
    };

    if (novosDados.ativo !== undefined) {
        prodAlteracao.ativo = novosDados.ativo;
    };

    return res.status(200).json(prodAlteracao);
});

app.listen(PORT, () => {
    console.log(`Servidor funcionando na porta ${PORT}`);
});