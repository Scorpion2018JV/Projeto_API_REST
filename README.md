# Projeto API REST - Controle de Estoque e Vendas
Equipe: Abimael Siebra Bueno e João Vitor Viana Segobia Cruz

Esta API simula o controle de estoque e vendas de um pequeno comércio. Ela permite cadastrar produtos e fornecedores, registrar entradas de mercadoria, realizar vendas, acompanhar o estoque, consultar movimentações e cancelar ou corrigir vendas.

Para testar a API, é recomendado usar o Postman.

Base da API: http://localhost:3000

Os dados ficam em memória. Ao reiniciar o servidor, as alterações dos testes são perdidas e os dados voltam ao estado inicial de dadosTeste.js.

Rota inicial

GET /
Verifica se a API está funcionando.


GET http://localhost:3000/


Produtos

GET /produtos
Lista todos os produtos cadastrados.


GET http://localhost:3000/produtos


GET /produtos/:id
Consulta um produto pelo ID.


GET http://localhost:3000/produtos/1


POST /produtos
Cadastra um novo produto. O estoque inicial sempre será 0.


{
  "nome": "Macarrao",
  "descricao": "Macarrao espaguete 500 g",
  "preco": 6.5,
  "estoqueMinimo": 5,
  "fornecedorId": 1,
  "ativo": true
}


O fornecedorId deve pertencer a um fornecedor existente. Para aumentar o estoque depois do cadastro, use POST /movimentacoes/entrada.

PATCH /produtos/:id
Altera dados de um produto. Envie apenas os campos que deseja modificar.


PATCH http://localhost:3000/produtos/1



{
  "preco": 27.9,
  "estoqueMinimo": 6
}


Também podem ser alterados nome, descricao, fornecedorId e ativo. O estoque não é alterado por esta rota.

DELETE /produtos/:id
Exclui um produto.


DELETE http://localhost:3000/produtos/6


Produtos que já possuem vendas ou movimentações vinculadas não podem ser excluídos. Para testar uma exclusão com sucesso, crie um produto novo e exclua-o antes de movimentá-lo.

Fornecedores

GET /fornecedores
Lista todos os fornecedores.


GET http://localhost:3000/fornecedores


GET /fornecedores/:id
Consulta um fornecedor pelo ID.


GET http://localhost:3000/fornecedores/1


POST /fornecedores
Cadastra um novo fornecedor.


{
  "nome": "Distribuidora Sul",
  "cnpj": "44555666000177",
  "telefone": "67999990004",
  "email": "sul@exemplo.com",
  "ativo": true
}


PATCH /fornecedores/:id
Altera dados de um fornecedor. Envie apenas os campos que deseja modificar.


PATCH http://localhost:3000/fornecedores/1



{
  "telefone": "67988880001",
  "email": "novoemail@exemplo.com"
}


Podem ser alterados nome, telefone, email e ativo.

DELETE /fornecedores/:id
Exclui um fornecedor.


DELETE http://localhost:3000/fornecedores/4


Fornecedores que ainda possuem produtos vinculados não podem ser excluídos. Para testar uma exclusão com sucesso, crie um fornecedor novo e exclua-o antes de vinculá-lo a um produto.

Vendas

GET /vendas
Lista todas as vendas registradas.


GET http://localhost:3000/vendas


GET /vendas/:id
Consulta uma venda pelo ID e mostra também os itens da venda.


GET http://localhost:3000/vendas/1


POST /vendas
Registra uma nova venda. A API calcula o valor total, reduz o estoque e cria as movimentações de saída.


{
  "itens": [
    {
      "produtoId": 1,
      "quantidade": 1
    },
    {
      "produtoId": 2,
      "quantidade": 2
    }
  ]
}


A quantidade deve ser inteira e maior que zero. O produto deve existir, estar ativo e ter estoque suficiente. O mesmo produto não pode aparecer duas vezes na mesma venda.

PATCH /vendas/:id/cancelar
Cancela uma venda finalizada. O cancelamento só pode acontecer no mesmo dia da venda e os produtos retornam ao estoque.

Cancelamento simples:


PATCH http://localhost:3000/vendas/5/cancelar



{
  "motivoCancelamento": "Cliente desistiu da compra"
}


Se também forem enviados novos itens, a mesma rota faz uma correção da venda: cancela a venda original e cria outra com os itens corrigidos.


{
  "motivoCancelamento": "Quantidade registrada incorretamente",
  "itens": [
    {
      "produtoId": 1,
      "quantidade": 3
    },
    {
      "produtoId": 4,
      "quantidade": 1
    }
  ]
}


Na correção, os itens da venda original voltam ao estoque antes da nova venda ser criada. A venda antiga fica como cancelada e recebe o ID da nova venda em vendaSubstitutaId.

As vendas já existentes em dadosTeste.js possuem datas anteriores. Para testar cancelamento ou correção com sucesso, crie primeiro uma venda com POST /vendas e use o ID retornado.

Itens de venda

GET /itensVenda
Lista todos os itens registrados nas vendas.


GET http://localhost:3000/itensVenda


Movimentações

GET /movimentacoes
Lista todas as entradas e saídas de estoque.


GET http://localhost:3000/movimentacoes


GET /movimentacoes/:id
Consulta uma movimentação pelo ID.


GET http://localhost:3000/movimentacoes/1


POST /movimentacoes/entrada
Registra uma entrada de mercadoria e aumenta o estoque do produto.


{
  "produtoId": 3,
  "quantidade": 10,
  "fornecedorId": 1,
  "motivo": "Reposicao de estoque"
}


O produto e o fornecedor devem existir. A quantidade deve ser inteira e maior que zero.

Estoque

GET /estoque
Mostra o estoque atual e o estoque mínimo de todos os produtos.


GET http://localhost:3000/estoque


GET /estoque/baixo
Lista os produtos que estão abaixo do estoque mínimo.


GET http://localhost:3000/estoque/baixo


Relatório de vendas

GET /relatorios/vendas
Lista as vendas e permite filtrar por período usando inicio e fim.

Sem filtro:


GET http://localhost:3000/relatorios/vendas


Com período:


GET http://localhost:3000/relatorios/vendas?inicio=2026-10-02T00:00:00-04:00&fim=2026-10-03T23:59:59-04:00


Os parâmetros são opcionais. Pode ser usado apenas inicio, apenas fim ou os dois juntos.