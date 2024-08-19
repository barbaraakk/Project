const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Carregar variáveis de ambiente
const twitterBearerToken = process.env.TWITTER_BEARER_TOKEN;

// Serve arquivos estáticos da pasta 'public'
app.use(express.static('public'));

// Rota para buscar tweets
app.get('/tweets', async (req, res) => {
  try {
    const response = await axios.get('https://api.twitter.com/2/tweets/search/recent', {
      headers: {
        'Authorization': `Bearer ${twitterBearerToken}`, // Usando a variável carregada
        'User-Agent': 'YourAppName'
      },
      params: {
        query: 'from:MandZatsu', // Ajuste conforme necessário
        max_results: 5 // Número máximo de tweets retornados
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Erro ao buscar tweets:', error.response ? error.response.data : error.message);
    res.status(500).send('Erro ao buscar tweets');
  }
});

// Rota para servir a página inicial
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/../public/index.html');
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
