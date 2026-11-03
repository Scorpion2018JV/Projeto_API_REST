import express from 'express'
import produtosRoutes from './routes/produtos.routes.js';
import fornecedoresRoutes from './routes/fornecedores.routes.js';
import movimentacoesRoutes from './routes/movimentacoes.routes.js';
import estoqueRoutes from './routes/estoque.routes.js';
import relatoriosRoutes from './routes/relatorios.routes.js';
import itensVendaRoutes from './routes/itensVenda.routes.js';
import vendasRoutes from './routes/vendas.routes.js';

const app = express();
app.use(express.json());

app.get ('/', (req, res) => {
    res.status(200).send('API de gerenciamento de vendas e produtos no ar');
});

app.use('/produtos', produtosRoutes);
app.use('/fornecedores', fornecedoresRoutes);
app.use('/movimentacoes', movimentacoesRoutes);
app.use('/estoque', estoqueRoutes);
app.use('/relatorios', relatoriosRoutes);
app.use('/itensVenda', itensVendaRoutes);
app.use('/vendas', vendasRoutes);