require('dotenv').config();

const express = require('express');
const axios = require('axios');
const app = express();

const twitterBearerToken = process.env.TWITTER_BEARER_TOKEN;

app.get('/tweets', async (req, res) => {
    try {
        const response = await axios.get('https://api.twitter.com/2/tweets', {
            headers: {
                'Authorization': `Bearer ${twitterBearerToken}`
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).send('Error fetching tweets');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
