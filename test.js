require('dotenv').config();

const express = require('express');
const axios = require('axios');
const app = express();

const twitterBearerToken = process.env.TWITTER_BEARER_TOKEN;

// Rota para buscar tweets
app.get('/tweets', async (req, res) => {
    try {
      const response = await axios.get('https://api.twitter.com/2/tweets/search/recent', {
        headers: {
          'Authorization': `Bearer ${twitterBearerToken}`,
          'User-Agent': 'TweetFetcher/1.0' // Nome e versão da sua aplicação
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
  
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
