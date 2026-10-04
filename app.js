import express from 'express'
const app = express();
app.use(express.json());

import { produtos, fornecedores, vendas, itensVenda, movimentacoes } from "./dadosTeste.js";

const PORT = 3000;

let proximoIdProd = 6;
let proximoIdForn = 4;

app.get ('/', (req, res) => {
    res.status(200).send('API de gerenciamento de vendas e produtos ar');
});


//-------Produtos-------


app.get ('/produtos', (req, res) => {
    return res.status(200).json(produtos);
});

app.get ('/produtos/:id', (req, res) => {
    const { id } = req.params;
    const buscaProd = produtos.find( p => p.id === Number(id));

    if (!buscaProd) {
        return res.status(404).json({error: "Produto não encontrado."});
    };

    return res.status(200).json(buscaProd);
});

app.post ('/produtos', (req, res) => {
    const dados = req.body;
    const existeFornecedor = fornecedores.find( f => f.id === Number(dados.fornecedorId) );

    if (!existeFornecedor){
        return res.status(400).json({error: "O fornecedor indicado não existe."});
    }

    const novoProduto = {
        ...dados,
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

    const itemVinculado = itensVenda.find( item => item.produtoId === Number(id) );
    const movimentacaoVinculada = movimentacoes.find( mov => mov.produtoId === Number(id) );

    if (itemVinculado || movimentacaoVinculada) {
        return res.status(409).json(
            {error: "Não é possível excluir este produto, pois existem vendas ou movimentações vinculadas a ele."}
        );
    }

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
        const existeFornecedor = fornecedores.find( f => f.id === Number(novosDados.fornecedorId) );

        if (!existeFornecedor){
            return res.status(400).json({error: "O fornecedor indicado não existe."});
        }
        
        prodAlteracao.fornecedorId = novosDados.fornecedorId;
    };

    if (novosDados.ativo !== undefined) {
        prodAlteracao.ativo = novosDados.ativo;
    };

    return res.status(200).json(prodAlteracao);
});


//-------Fornecedores-------


app.get ('/fornecedores', (req, res) => {
    return res.status(200).json(fornecedores);
});

app.get ('/fornecedores/:id', (req, res) => {
    const { id } = req.params;
    const buscaForn = fornecedores.find( p => p.id === Number(id));

    if (!buscaForn) {
        return res.status(404).json({error: "Fornecedor não encontrado."});
    };

    return res.status(200).json(buscaForn);
});

app.post ('/fornecedores', (req, res) => {
    const novoFornecedor = {
        ...req.body,
        id: proximoIdForn,
    };

    proximoIdForn++;
    fornecedores.push(novoFornecedor);

    return res.status(201).json(novoFornecedor);
});

app.delete ('/fornecedores/:id', (req, res) => {
    const { id } = req.params;
    const indice = fornecedores.findIndex( p => p.id === Number(id));

    if (indice === -1){
        return res.status(404).json({error: "Fornecedor não encontrado."});
    };

    const produtoVinculado = produtos.find( p => p.fornecedorId === Number(id) );

    if (produtoVinculado) {
        return res.status(409).json(
            {error: "Não é possível excluir este fornecedor, pois existem produtos vinculados a ele."}
        );
    };

    const [fornDeletado] = fornecedores.splice(indice, 1);

    return res.status(200).json({message: "Fornecedor deletado com sucesso!", fornDeletado});
});

app.patch ('/fornecedores/:id', (req, res) => {
    const { id } = req.params;
    const fornAlteracao = fornecedores.find( p => p.id === Number(id));

    if (!fornAlteracao){
        return res.status(404).json({error: "Fornecedor não encontrado."});
    };

    const novosDados = req.body;

    if (novosDados.nome !== undefined) {
        fornAlteracao.nome = novosDados.nome;
    };

    if (novosDados.telefone !== undefined) {
        fornAlteracao.telefone = novosDados.telefone;
    };

    if (novosDados.email !== undefined) {
        fornAlteracao.email = novosDados.email;
    };

    if (novosDados.ativo !== undefined) {
        fornAlteracao.ativo = novosDados.ativo;
    };

    return res.status(200).json(fornAlteracao);
});

app.listen(PORT, () => {
    console.log(`Servidor funcionando na porta ${PORT}`);
});