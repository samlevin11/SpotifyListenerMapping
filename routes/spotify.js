const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', (req, res) => {
    console.log('ACCESS TOKEN: ' + req.query.access_token);
    // res.render('map');

    axios({
        method: 'get',
        url: 'https://api.spotify.com/v1/me/following?type=artist&limit=50',
        headers: {
            Authorization: `Bearer ${req.query.access_token}`,
        },
    })
        .then((response) => {
            console.log(JSON.stringify(response.data));
            res.json(response.data);
        })
        .catch((error) => {
            console.log(error);
        });
});

module.exports = router;
