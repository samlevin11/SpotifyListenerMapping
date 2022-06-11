require('dotenv').config();
const express = require('express');
const { nextTick } = require('process');
const querystring = require('querystring');
const app = express();
const port = 3000;

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

app.use(logger);

app.get('/', (req, res) => {
    res.send('root');
});

app.get('/login', (req, res) => {
    const queryParams = querystring.stringify({
        client_id: CLIENT_ID,
        response_type: 'code',
        redirect_uri: REDIRECT_URI,
    });
    res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
});

function logger(req, res, next) {
    console.log(req.originalUrl);
    next();
}

app.listen(port, () => {
    console.log(`Express app listening at http://localhost:${port}`);
});
