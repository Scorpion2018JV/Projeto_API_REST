import express from 'express'
const app = express();
app.use(express.json());

import { produtos, fornecedores, vendas, itensVenda, movimentacoes } from "./dadosTeste.js";

const PORT = 3000;

let proximoIdProd = 6;
let proximoIdForn = 4;
let proximoIdVenda = 5;
let proximoIdMov = 20;
let proximoIdItem = 12;

app.get ('/', (req, res) => {
    res.status(200).send('API de gerenciamento de vendas e produtos no ar');
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
    if (dados.preco < 0) {
        return res.status(400).json({error: "O preço não pode ser negativo."});
    }

    const existeFornecedor = fornecedores.find( f => f.id === Number(dados.fornecedorId) );

    if (!existeFornecedor){
        return res.status(400).json({error: "O fornecedor indicado não existe."});
    }

    const novoProduto = {
        ...dados,
        fornecedorId: Number(dados.fornecedorId),
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

    if (novosDados.preco !== undefined && novosDados.preco < 0) {
        return res.status(400).json({error: "O preço não pode ser negativo."});
    }

    if (novosDados.fornecedorId !== undefined) {
        const existeFornecedor = fornecedores.find( f => f.id === Number(novosDados.fornecedorId) );

        if (!existeFornecedor) {
            return res.status(400).json({error: "O fornecedor indicado não existe."});
        }
    }

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
        prodAlteracao.fornecedorId = Number(novosDados.fornecedorId);
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
    const movimentacaoVinculada = movimentacoes.find( m => m.fornecedorId === Number(id) );

    if (produtoVinculado || movimentacaoVinculada) {
        return res.status(409).json({error: "Existem produtos ou movimentações vinculados a este fornecedor."});
    }

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

app.get('/movimentacoes', (req, res) => {
    return res.status(200).json(movimentacoes);
});

app.get('/movimentacoes/:id', (req, res) => {
    const { id } = req.params;
    const buscaMov = movimentacoes.find( m => m.id === Number(id));

    if (!buscaMov) {
        return res.status(404).json({error: "Movimentação não encontrada"});
    };

    return res.status(200).json(buscaMov);
});

app.post('/movimentacoes/entrada', (req, res) => {
    const { produtoId, quantidade, fornecedorId, motivo } = req.body;

    const buscaProduto = produtos.find(p => p.id === Number(produtoId));

    if (!buscaProduto) {
        return res.status(404).json({error: "Produto não encontrado."});
    }

    const buscaForn = fornecedores.find( f => f.id === Number(fornecedorId) );

    if (!buscaForn) {
        return res.status(404).json({error: "Fornecedor não encontrado"});
    };

    if (!Number.isInteger(quantidade) || quantidade <= 0) {
        return res.status(400).json({error: "A quantidade deve ser um número inteiro maior que zero."});
    };

    if (!motivo) {
        return res.status(400).json({error: "Informe o motivo da entrada."});
    };

    buscaProduto.estoque += quantidade;

    const novaMovimentacao = {
        id: proximoIdMov,
        produtoId: buscaProduto.id,
        tipo: "entrada",
        quantidade: quantidade,
        data: new Date().toISOString(),
        fornecedorId: buscaForn.id,
        vendaId: null,
        motivo: motivo
    };

    proximoIdMov++;
    movimentacoes.push(novaMovimentacao);

    return res.status(201).json({
        message: "Entrada de mercadoria registrada com sucesso.",
        movimentacao: novaMovimentacao,
    });
});

app.get('/estoque', (req, res) => {
    const estoque = produtos.map(p => ({
        id: p.id,
        nome: p.nome,
        estoque: p.estoque,
        estoqueMinimo: p.estoqueMinimo
    }));

    return res.status(200).json(estoque);
});

app.get('/estoque/baixo', (req, res) => {
    const produtosAbaixo = produtos.filter(p => p.estoque < p.estoqueMinimo);

    return res.status(200).json(produtosAbaixo);
});

app.get('/relatorios/vendas', (req, res) => {
    const { inicio, fim } = req.query;

    let vendasRelatorio = vendas;

    if (inicio) {
        vendasRelatorio = vendasRelatorio.filter(v => new Date(v.data) >= new Date(inicio));
    }

    if (fim) {
        vendasRelatorio = vendasRelatorio.filter(v => new Date(v.data) <= new Date(fim));
    }

    return res.status(200).json(vendasRelatorio);
});

app.listen(PORT, () => {
    console.log(`Servidor funcionando na porta ${PORT}`);
});