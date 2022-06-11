require('dotenv').config();
const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const { generateRandomString } = require('./helpers');
const app = express();
const port = 3000;
``;

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

const stateKey = 'spotify_auth_state';

app.use(logger);

app.get('/', (req, res) => {
    res.send('root');
});

app.get('/login', (req, res) => {
    const state = generateRandomString(16);
    res.cookie(stateKey, state);

    const scope = 'user-follow-read';

    const queryParams = querystring.stringify({
        client_id: CLIENT_ID,
        response_type: 'code',
        redirect_uri: REDIRECT_URI,
        state,
        scope,
    });
    res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
});

app.get('/callback', (req, res) => {
    const code = req.query.code || null;

    axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        data: querystring.stringify({
            grant_type: 'authorization_code',
            code,
            redirect_uri: REDIRECT_URI,
        }),
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${new Buffer.from(
                `${CLIENT_ID}:${CLIENT_SECRET}`
            ).toString('base64')}`,
        },
    })
        .then((response) => {
            if (response.status === 200) {
                const { access_token, token_type } = response.data;

                axios
                    .get('https://api.spotify.com/v1/me', {
                        headers: {
                            Authorization: `${token_type} ${access_token}`,
                        },
                    })
                    .then((response) => {
                        res.send(
                            `<pre>${JSON.stringify(
                                response.data,
                                null,
                                2
                            )}</pre>`
                        );
                    })
                    .catch((error) => {
                        res.send(error);
                    });
            } else {
                res.send(response);
            }
        })
        .catch((error) => {
            res.send(error);
        });
});

app.get('/refresh_token', (req, res) => {
    const { refresh_token } = req.query;

    axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        data: querystring.stringify({
            grant_type: 'refresh_token',
            refresh_token,
        }),
        headers: {
            content_type: 'application/x-www-form-urlencoded',
            Authorization: `Basic ${new Buffer.from(
                `${CLIENT_ID}:${CLIENT_SECRET}`
            ).toString('base64')}`,
        },
    })
        .then((response) => {
            res.send(response.data);
        })
        .catch((error) => {
            res.send(error);
        });
});

function logger(req, res, next) {
    console.log(req.originalUrl);
    next();
}

app.listen(port, () => {
    console.log(`Express app listening at http://localhost:${port}`);
});
