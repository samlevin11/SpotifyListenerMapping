const express = require('express');
const router = express.Router();
const axios = require('axios');
const { json } = require('express/lib/response');

router.get('/', (req, res) => {
    // res.render('map');

    getFollowedArtists(req.query.access_token, res);

    // axios({
    //     method: 'get',
    //     url: 'https://api.spotify.com/v1/me/following?type=artist&limit=50',
    //     headers: {
    //         Authorization: `Bearer ${req.query.access_token}`,
    //     },
    // })
    //     .then((response) => {
    //         console.log(JSON.stringify(response.data));
    //         res.json(response.data);
    //     })
    //     .catch((error) => {
    //         console.log(error);
    //     });
});

function getFollowedArtists(access_token, res) {
    console.log('Getting followed artists');

    const token = access_token;

    const initialNext =
        'https://api.spotify.com/v1/me/following?type=artist&limit=50';

    let followedArtists = [];

    axios({
        method: 'get',
        url: 'https://api.spotify.com/v1/me/following?type=artist&limit=50',
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    })
        .then((response) => {
            followedArtists = followedArtists.concat(
                response.data.artists.items
            );
            console.log(
                `Collected ${followedArtists.length} of ${response.data.artists.total} artists`
            );

            console.log(response.data.artists.next);
            if (response.data.artists.next) {
                console.log('More!');
                followNextArtists(response.data.artists.next, token);
            } else {
                console.log('No more!');
            }
            res.json(followedArtists);
        })
        .catch((error) => {
            console.log(error);
        });

    function followNextArtists(next, access_token) {
        axios({
            method: 'get',
            url: next,
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        })
            .then((response) => {
                followedArtists = followedArtists.concat(
                    response.data.artists.items
                );
                console.log(
                    `Collected ${followedArtists.length} of ${response.data.artists.total} artists`
                );

                console.log(response.data.artists.next);
                if (response.data.artists.next) {
                    followNextArtists(response.data.artists.next);
                } else {
                    console.log('No more artists!');
                    return followedArtists;
                }
                res.json(followedArtists);
            })
            .catch((error) => {
                console.log(error);
            });
    }
}

module.exports = router;
