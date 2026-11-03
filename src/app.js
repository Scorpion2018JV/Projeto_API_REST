import express from 'express'
import produtosRoutes from './routes/produtos.routes.js';
import fornecedoresRoutes from './routes/fornecedores.routes.js';
import movimentacoesRoutes from './routes/movimentacoes.routes.js';
import estoqueRoutes from './routes/estoque.routes.js';
import relatoriosRoutes from './routes/relatorios.routes.js';

const app = express();
app.use(express.json());

import { produtos, fornecedores, vendas, itensVenda, movimentacoes } from "./data/dadosTeste.js";

let proximoIdVenda = 5;
let proximoIdMov = 20;
let proximoIdItem = 12;

app.get ('/', (req, res) => {
    res.status(200).send('API de gerenciamento de vendas e produtos no ar');
});

app.use('/produtos', produtosRoutes);
app.use('/fornecedores', fornecedoresRoutes);
app.use('/movimentacoes', movimentacoesRoutes);
app.use('/estoque', estoqueRoutes);
app.use('/relatorios', relatoriosRoutes);


//-------Vendas-------


app.get('/vendas', (req, res) => {
    return res.status(200).json(vendas);
});

app.get('/vendas/:id', (req, res) => {
    const { id } = req.params;
    const buscaVenda = vendas.find( venda => venda.id === Number(id) );

    if (!buscaVenda){
        return res.status(404).json({error: "Venda não encontrada."});
    };

    const buscaItens = itensVenda.filter( item => item.vendaId === buscaVenda.id );

    return res.status(200).json({
        venda: buscaVenda,
        itens: buscaItens
    });
});

app.post('/vendas', (req, res) => {
    const itens = req.body.itens;

    if (!Array.isArray(itens) || itens.length === 0) {
            return res.status(400).json({error: "A nova venda precisa ter pelo menos um produto."});
        }


    let valorTotal = 0;

    for (let i = 0; i < itens.length; i++) {
        const produto = produtos.find( p => p.id === Number(itens[i].produtoId) );

        if (!produto) {
            return res.status(404).json({
                error: `O produto com identificação ${itens[i].produtoId} não foi encontrado.`
            });
        }

        if (!produto.ativo) {
            return res.status(400).json({error: "O produto está inativo."});
        }

        const quantidade = itens[i].quantidade;

        if (!Number.isInteger(quantidade) || quantidade <= 0) {
            return res.status(400).json({
                error: "A quantidade deve ser um número inteiro maior que zero."
            });
        }

        for (let j = 0; j < i; j++) {
            if (Number(itens[j].produtoId) === produto.id) {
                return res.status(400).json({
                    error: `O produto ${produto.nome} foi informado mais de uma vez.`
                });
            }
        }

        if (produto.estoque < quantidade) {
            return res.status(400).json({
                error: "Estoque insuficiente para o produto " + produto.nome
            });
        }

        valorTotal += produto.preco * quantidade;
    }

    valorTotal = Number(valorTotal.toFixed(2));

    const novaVenda = {
        id: proximoIdVenda,
        data: new Date().toISOString(),
        valorTotal: valorTotal,
        status: "finalizada",
        dataCancelamento: null,
        motivoCancelamento: null,
        vendaSubstitutaId: null
    };
    proximoIdVenda++;
    vendas.push(novaVenda);

    for (let i = 0; i < itens.length; i++) {
        const produto = produtos.find( p => p.id === Number(itens[i].produtoId) );

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

        const novaMovimentacao = {
            id: proximoIdMov,
            produtoId: produto.id,
            tipo: "saida",
            quantidade: quantidade,
            data: novaVenda.data,
            fornecedorId: null,
            vendaId: novaVenda.id,
            motivo: "Venda"
        };
        proximoIdMov++;
        movimentacoes.push(novaMovimentacao);
    }

    return res.status(201).json({
        venda: novaVenda,
        itens: itensVenda.filter( item => item.vendaId === novaVenda.id )
    });
});

app.patch('/vendas/:id/cancelar', (req, res) => {
    const { id } = req.params;
    const venda = vendas.find(v => v.id === Number(id));

    if (!venda) {
        return res.status(404).json({error: "Venda não encontrada."});
    };

    if (venda.status === "cancelada") {
        return res.status(400).json({error: "Esta venda já foi cancelada."});
    };

    const dataAtual = new Date();
    const dataVenda = new Date(venda.data);

    if (dataAtual.getFullYear() !== dataVenda.getFullYear() ||
        dataAtual.getMonth() !== dataVenda.getMonth() ||
        dataAtual.getDate() !== dataVenda.getDate()) {
        return res.status(400).json({error: "Uma venda só pode ser cancelada no mesmo dia em que foi realizada."});
    };

    const { motivoCancelamento, itens } = req.body || {};

    if (!motivoCancelamento) {
        return res.status(400).json({error: "Informe o motivo do cancelamento."});
    };

    const itensOriginais = itensVenda.filter( item => item.vendaId === venda.id );
    const vaiCriarVendaCorrigida = itens !== undefined;

    let valorTotalNovaVenda = 0;

    if (vaiCriarVendaCorrigida) {
        if (!Array.isArray(itens) || itens.length === 0) {
            return res.status(400).json({
                error: "A nova venda precisa ter pelo menos um produto."
            });
        }

        for (let i = 0; i < itens.length; i++) {
            const produto = produtos.find( p => p.id === Number(itens[i].produtoId) );

            if (!produto) {
                return res.status(404).json({
                    error: `O produto com identificação ${itens[i].produtoId} não foi encontrado.`
                });
            }

            if (!produto.ativo) {
                return res.status(400).json({error: "O produto está inativo."});
            }

            const quantidade = itens[i].quantidade;

            if (!Number.isInteger(quantidade) || quantidade <= 0) {
                return res.status(400).json({error: "A quantidade deve ser um número inteiro maior que zero."});
            }

            for (let j = 0; j < i; j++) {
                if (Number(itens[j].produtoId) === produto.id) {
                    return res.status(400).json({error: `O produto ${produto.nome} foi informado mais de uma vez.`});
                }
            }

            let estoqueDisponivel = produto.estoque;

            for (let j = 0; j < itensOriginais.length; j++) {
                if (itensOriginais[j].produtoId === produto.id) {
                    estoqueDisponivel += itensOriginais[j].quantidade;
                }
            }

            if (estoqueDisponivel < quantidade) {
                return res.status(400).json({error: "Estoque insuficiente para o produto " + produto.nome});
            }

            valorTotalNovaVenda += produto.preco * quantidade;
        }

        valorTotalNovaVenda = Number(valorTotalNovaVenda.toFixed(2));
    }

    const dataCancelamento = new Date().toISOString();

    for (let i = 0; i < itensOriginais.length; i++) {

        const item = itensOriginais[i];

        const produto = produtos.find(
            p => p.id === item.produtoId
        );

        produto.estoque += item.quantidade;

        const movimentacaoCancelamento = {
            id: proximoIdMov,
            produtoId: produto.id,
            tipo: "entrada",
            quantidade: item.quantidade,
            data: dataCancelamento,
            fornecedorId: null,
            vendaId: venda.id,
            motivo: "Cancelamento de venda"
        };

        proximoIdMov++;
        movimentacoes.push(movimentacaoCancelamento);
    }

    venda.status = "cancelada";
    venda.dataCancelamento = dataCancelamento;
    venda.motivoCancelamento = motivoCancelamento;

    if (!vaiCriarVendaCorrigida) {
        return res.status(200).json({
            message: "Venda cancelada com sucesso.",
            vendaCancelada: venda
        });
    }

    const novaVenda = {
        id: proximoIdVenda,
        data: new Date().toISOString(),
        valorTotal: valorTotalNovaVenda,
        status: "finalizada",
        dataCancelamento: null,
        motivoCancelamento: null,
        vendaSubstitutaId: null
    };
    proximoIdVenda++;
    venda.vendaSubstitutaId = novaVenda.id;
    vendas.push(novaVenda);

    for (let i = 0; i < itens.length; i++) {
        const produto = produtos.find( p => p.id === Number(itens[i].produtoId) );
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

        const movimentacaoVendaCorrigida = {
            id: proximoIdMov,
            produtoId: produto.id,
            tipo: "saida",
            quantidade: quantidade,
            data: novaVenda.data,
            fornecedorId: null,
            vendaId: novaVenda.id,
            motivo: "Venda corrigida"
        };
        proximoIdMov++;
        movimentacoes.push(movimentacaoVendaCorrigida);
    }

    return res.status(200).json({
        message: "Venda cancelada e nova venda corrigida criada com sucesso.",
        vendaCancelada: venda,
        novaVenda: novaVenda,
        itensNovaVenda: itensVenda.filter( item => item.vendaId === novaVenda.id )
    });
});

app.get('/itensVenda', (req, res) => {
    return res.status(200).json(itensVenda);
});

export default app;