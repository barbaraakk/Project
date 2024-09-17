const express = require('express');
require('dotenv').config(); // Carregar variáveis de ambiente
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Data e hora alvo em horário de Brasília
const targetDate = new Date('2024-09-17T00:00:00-03:00'); // Data alvo ajustada para GMT-3

// Middleware para servir arquivos estáticos da pasta 'public'
app.use(express.static('public'));

// Rota para servir a página de contagem regressiva
app.get('/time', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'time.html')); // A página de contagem regressiva é time.html
});

// Rota para servir a página inicial
app.get('/', (req, res) => {
  const now = new Date();
  if (now >= targetDate) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    res.redirect('/time'); // Redireciona para time.html
  }
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
