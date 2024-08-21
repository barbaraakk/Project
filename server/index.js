const express = require('express');
require('dotenv').config(); // Carregar variáveis de ambiente
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Serve arquivos estáticos da pasta 'public'
app.use(express.static('public'));

// Rota para servir a página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

// Middleware para tratamento de erros 404
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Middleware para tratamento de erros gerais
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo deu errado!');
});

