import express from 'express'
const app = express();
const PORT = 3000;
app.use(express.json());

import { produtos, fornecedores, vendas, itensVenda, movimentacoes } from "./dadosTeste.js";

app.get ('/produtos', (req, res) => {
    res.status(200).json(produtos)
})

app.listen(PORT, () => {
    console.log(`Servidor funcionando na porta ${PORT}`)
});