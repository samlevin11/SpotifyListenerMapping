const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', (req, res) => {
    // res.render('map');
    let accessToken = req.user.accessToken
    console.log('ACCESS TOKEN: ', accessToken);
    getFollowedArtists(accessToken).then((response) => {
        console.log(response.length);
        res.json(response);
    });
});

function getFollowedArtists(access_token) {
    console.log('Getting followed artists');

    const token = access_token;

    const initialNext =
        'https://api.spotify.com/v1/me/following?type=artist&limit=50';

    return followNextArtists(initialNext, [], token);

    function followNextArtists(next, followedArtists, access_token) {
        return new Promise((resolve, reject) => {
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

                    if (response.data.artists.next) {
                        console.log(
                            `More artists, ${response.data.artists.next}`
                        );
                        resolve(
                            followNextArtists(
                                response.data.artists.next,
                                followedArtists,
                                access_token
                            )
                        );
                    } else {
                        console.log('No more artists!');
                        resolve(followedArtists);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        });
    }
}

module.exports = router;
