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
