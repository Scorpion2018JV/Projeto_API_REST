export const produtos = [
  {
    id: 1,
    nome: "Arroz",
    descricao: "Arroz tipo 1, pacote de 5 kg",
    preco: 25.90,
    estoque: 20,
    estoqueMinimo: 5,
    fornecedorId: 1,
    ativo: true
  },
  {
    id: 2,
    nome: "Feijao",
    descricao: "Feijao carioca, pacote de 1 kg",
    preco: 8.50,
    estoque: 15,
    estoqueMinimo: 5,
    fornecedorId: 2,
    ativo: true
  },
  {
    id: 3,
    nome: "Oleo",
    descricao: "Oleo de soja, garrafa de 900 ml",
    preco: 7.20,
    estoque: 3,
    estoqueMinimo: 5,
    fornecedorId: 1,
    ativo: true
  },
  {
    id: 4,
    nome: "Acucar",
    descricao: "Acucar refinado, pacote de 1 kg",
    preco: 4.80,
    estoque: 30,
    estoqueMinimo: 8,
    fornecedorId: 2,
    ativo: true
  },
  {
    id: 5,
    nome: "Cafe",
    descricao: "Cafe torrado e moido, pacote de 500 g",
    preco: 18.90,
    estoque: 0,
    estoqueMinimo: 4,
    fornecedorId: 1,
    ativo: true
  }
];

export const fornecedores = [
  {
    id: 1,
    nome: "Distribuidora Central",
    cnpj: "12345678000190",
    telefone: "67999990001",
    email: "central@exemplo.com",
    ativo: true
  },
  {
    id: 2,
    nome: "Atacado Brasil",
    cnpj: "98765432000110",
    telefone: "67999990002",
    email: "atacado@exemplo.com",
    ativo: true
  },
  {
    id: 3,
    nome: "Mercantil do Vale",
    cnpj: "11222333000144",
    telefone: "67999990003",
    email: "mercantil@exemplo.com",
    ativo: true
  }
];

export const vendas = [
  {
    id: 1,
    data: "2026-10-03T09:00:00-04:00",
    valorTotal: 85.80,
    status: "finalizada",
    dataCancelamento: null,
    motivoCancelamento: null,
    vendaSubstitutaId: null
  },
  {
    id: 2,
    data: "2026-10-03T09:30:00-04:00",
    valorTotal: 32.80,
    status: "finalizada",
    dataCancelamento: null,
    motivoCancelamento: null,
    vendaSubstitutaId: null
  },
  {
    id: 3,
    data: "2026-10-02T14:00:00-04:00",
    valorTotal: 50.80,
    status: "cancelada",
    dataCancelamento: "2026-10-02T15:00:00-04:00",
    motivoCancelamento: "Erro na quantidade de produtos",
    vendaSubstitutaId: 4
  },
  {
    id: 4,
    data: "2026-10-02T15:05:00-04:00",
    valorTotal: 76.70,
    status: "finalizada",
    dataCancelamento: null,
    motivoCancelamento: null,
    vendaSubstitutaId: null
  }
];

export const itensVenda = [
  {
    id: 1,
    vendaId: 1,
    produtoId: 1,
    nomeProduto: "Arroz",
    quantidade: 2,
    precoUnitario: 25.90,
    subtotal: 51.80
  },
  {
    id: 2,
    vendaId: 1,
    produtoId: 2,
    nomeProduto: "Feijao",
    quantidade: 4,
    precoUnitario: 8.50,
    subtotal: 34.00
  },
  {
    id: 3,
    vendaId: 2,
    produtoId: 3,
    nomeProduto: "Oleo",
    quantidade: 1,
    precoUnitario: 7.20,
    subtotal: 7.20
  },
  {
    id: 4,
    vendaId: 2,
    produtoId: 4,
    nomeProduto: "Acucar",
    quantidade: 2,
    precoUnitario: 4.80,
    subtotal: 9.60
  },
  {
    id: 5,
    vendaId: 2,
    produtoId: 2,
    nomeProduto: "Feijao",
    quantidade: 1,
    precoUnitario: 8.50,
    subtotal: 8.50
  },
  {
    id: 6,
    vendaId: 3,
    produtoId: 1,
    nomeProduto: "Arroz",
    quantidade: 1,
    precoUnitario: 25.90,
    subtotal: 25.90
  },
  {
    id: 7,
    vendaId: 3,
    produtoId: 2,
    nomeProduto: "Feijao",
    quantidade: 2,
    precoUnitario: 8.50,
    subtotal: 17.00
  },
  {
    id: 8,
    vendaId: 3,
    produtoId: 4,
    nomeProduto: "Acucar",
    quantidade: 1,
    precoUnitario: 7.90,
    subtotal: 7.90
  },
  {
    id: 9,
    vendaId: 4,
    produtoId: 1,
    nomeProduto: "Arroz",
    quantidade: 2,
    precoUnitario: 25.90,
    subtotal: 51.80
  },
  {
    id: 10,
    vendaId: 4,
    produtoId: 3,
    nomeProduto: "Oleo",
    quantidade: 2,
    precoUnitario: 7.20,
    subtotal: 14.40
  },
  {
    id: 11,
    vendaId: 4,
    produtoId: 4,
    nomeProduto: "Acucar",
    quantidade: 2,
    precoUnitario: 5.25,
    subtotal: 10.50
  }
];

export const movimentacoes = [
  {
    id: 1,
    produtoId: 1,
    tipo: "entrada",
    quantidade: 22,
    data: "2026-10-01T08:00:00-04:00",
    fornecedorId: 1,
    vendaId: null,
    motivo: "Estoque inicial"
  },
  {
    id: 2,
    produtoId: 2,
    tipo: "entrada",
    quantidade: 20,
    data: "2026-10-01T08:10:00-04:00",
    fornecedorId: 2,
    vendaId: null,
    motivo: "Estoque inicial"
  },
  {
    id: 3,
    produtoId: 3,
    tipo: "entrada",
    quantidade: 6,
    data: "2026-10-01T08:20:00-04:00",
    fornecedorId: 1,
    vendaId: null,
    motivo: "Estoque inicial"
  },
  {
    id: 4,
    produtoId: 4,
    tipo: "entrada",
    quantidade: 35,
    data: "2026-10-01T08:30:00-04:00",
    fornecedorId: 2,
    vendaId: null,
    motivo: "Estoque inicial"
  },
  {
    id: 5,
    produtoId: 5,
    tipo: "entrada",
    quantidade: 4,
    data: "2026-10-01T08:40:00-04:00",
    fornecedorId: 1,
    vendaId: null,
    motivo: "Estoque inicial"
  },
  {
    id: 6,
    produtoId: 1,
    tipo: "saida",
    quantidade: 2,
    data: "2026-10-03T09:00:00-04:00",
    fornecedorId: null,
    vendaId: 1,
    motivo: "Venda"
  },
  {
    id: 7,
    produtoId: 2,
    tipo: "saida",
    quantidade: 4,
    data: "2026-10-03T09:00:00-04:00",
    fornecedorId: null,
    vendaId: 1,
    motivo: "Venda"
  },
  {
    id: 8,
    produtoId: 3,
    tipo: "saida",
    quantidade: 1,
    data: "2026-10-03T09:30:00-04:00",
    fornecedorId: null,
    vendaId: 2,
    motivo: "Venda"
  },
  {
    id: 9,
    produtoId: 4,
    tipo: "saida",
    quantidade: 2,
    data: "2026-10-03T09:30:00-04:00",
    fornecedorId: null,
    vendaId: 2,
    motivo: "Venda"
  },
  {
    id: 10,
    produtoId: 2,
    tipo: "saida",
    quantidade: 1,
    data: "2026-10-03T09:30:00-04:00",
    fornecedorId: null,
    vendaId: 2,
    motivo: "Venda"
  },
  {
    id: 11,
    produtoId: 1,
    tipo: "saida",
    quantidade: 1,
    data: "2026-10-02T14:00:00-04:00",
    fornecedorId: null,
    vendaId: 3,
    motivo: "Venda"
  },
  {
    id: 12,
    produtoId: 2,
    tipo: "saida",
    quantidade: 2,
    data: "2026-10-02T14:00:00-04:00",
    fornecedorId: null,
    vendaId: 3,
    motivo: "Venda"
  },
  {
    id: 13,
    produtoId: 4,
    tipo: "saida",
    quantidade: 1,
    data: "2026-10-02T14:00:00-04:00",
    fornecedorId: null,
    vendaId: 3,
    motivo: "Venda"
  },
  {
    id: 14,
    produtoId: 1,
    tipo: "entrada",
    quantidade: 1,
    data: "2026-10-02T15:00:00-04:00",
    fornecedorId: null,
    vendaId: 3,
    motivo: "Cancelamento de venda"
  },
  {
    id: 15,
    produtoId: 2,
    tipo: "entrada",
    quantidade: 2,
    data: "2026-10-02T15:00:00-04:00",
    fornecedorId: null,
    vendaId: 3,
    motivo: "Cancelamento de venda"
  },
  {
    id: 16,
    produtoId: 4,
    tipo: "entrada",
    quantidade: 1,
    data: "2026-10-02T15:00:00-04:00",
    fornecedorId: null,
    vendaId: 3,
    motivo: "Cancelamento de venda"
  },
  {
    id: 17,
    produtoId: 1,
    tipo: "saida",
    quantidade: 2,
    data: "2026-10-02T15:05:00-04:00",
    fornecedorId: null,
    vendaId: 4,
    motivo: "Venda"
  },
  {
    id: 18,
    produtoId: 3,
    tipo: "saida",
    quantidade: 2,
    data: "2026-10-02T15:05:00-04:00",
    fornecedorId: null,
    vendaId: 4,
    motivo: "Venda"
  },
  {
    id: 19,
    produtoId: 4,
    tipo: "saida",
    quantidade: 2,
    data: "2026-10-02T15:05:00-04:00",
    fornecedorId: null,
    vendaId: 4,
    motivo: "Venda"
  }
];