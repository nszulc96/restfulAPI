const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

const caminhoProdutos = path.join(__dirname, 'public', 'data', 'produtos.js');

let produtos = require('./public/data/produtos');

function salvarProdutosNoArquivo() {
  const conteudo = `module.exports = ${JSON.stringify(produtos, null, 2)};\n`;
  fs.writeFileSync(caminhoProdutos, conteudo, 'utf8');
}

app.get('/produtos', (req, res) => {
  res.json(produtos);
});

app.get('/produtos/:id', (req, res) => {
  const id = Number(req.params.id);
  const produto = produtos.find(p => p.id === id);

  if (produto) {
    res.json(produto);
  } else {
    res.status(404).json({ mensagem: 'Produto não encontrado' });
  }
});

app.post('/produtos', (req, res) => {
  const novoProduto = {
    ...req.body,
    id: produtos.length ? produtos[produtos.length - 1].id + 1 : 1,
    valor_custo: Number(req.body.valor_custo),
    valor_venda: Number(req.body.valor_venda),
    quantidade: Number(req.body.quantidade),
  };

  produtos.push(novoProduto);
  salvarProdutosNoArquivo();
  res.status(201).json(novoProduto);
});

app.put('/produtos/:id', (req, res) => {
  const { id } = req.params;
  const index = produtos.findIndex(p => p.id == id);

  if (index !== -1) {
    produtos[index] = {
      ...produtos[index],
      ...req.body,
      id: Number(id),
      valor_custo: Number(req.body.valor_custo),
      valor_venda: Number(req.body.valor_venda),
      quantidade: Number(req.body.quantidade)
    };
    salvarProdutosNoArquivo();
    res.json(produtos[index]);
  } else {
    res.status(404).json({ mensagem: 'Produto não encontrado' });
  }
});

app.delete('/produtos/:id', (req, res) => {
  const id = Number(req.params.id);
  produtos = produtos.filter(p => p.id !== id);
  salvarProdutosNoArquivo();
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
