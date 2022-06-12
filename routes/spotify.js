const express = require('express');
const router = express.Router();
const axios = require('axios');
const { json } = require('express/lib/response');

router.get('/', (req, res) => {
    // res.render('map');

    followedArtists = getFollowedArtists(req.query.access_token, res);
    console.log('FOLLOWED ARTISTS');
    console.log(followedArtists);
});

function getFollowedArtists(access_token, res) {
    console.log('Getting followed artists');

    const token = access_token;

    const initialNext =
        'https://api.spotify.com/v1/me/following?type=artist&limit=50';

    return followNextArtists(initialNext, [], token);

    function followNextArtists(next, followedArtists, access_token) {
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
                    followNextArtists(
                        response.data.artists.next,
                        followedArtists,
                        access_token
                    );
                } else {
                    console.log('No more artists!');
                    res.json(followedArtists)
                    return followedArtists;
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }
}

module.exports = router;
