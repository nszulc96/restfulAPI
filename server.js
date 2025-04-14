const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

const caminhoProdutos = path.join(__dirname, 'public', 'data', 'produtos.json');

function carregarProdutos() {
  const dados = fs.readFileSync(caminhoProdutos, 'utf8');
  return JSON.parse(dados);
}

app.get('/produtos', (req, res) => {
  const produtos = carregarProdutos();
  res.json(produtos);
});

app.get('/produtos/:id', (req, res) => {
  const id = Number(req.params.id);
  const produtos = carregarProdutos();
  const produto = produtos.find(p => p.id === id);

  if (produto) {
    res.json(produto);
  } else {
    res.status(404).json({ mensagem: 'Produto não encontrado' });
  }
});

app.post('/produtos', (req, res) => {
  const produtos = carregarProdutos();
  const novoProduto = {
    ...req.body,
    id: produtos.length ? produtos[produtos.length - 1].id + 1 : 1,
    valor_custo: Number(req.body.valor_custo),
    valor_venda: Number(req.body.valor_venda),
    quantidade: Number(req.body.quantidade),
  };

  produtos.push(novoProduto);
  res.status(201).json(novoProduto);
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
