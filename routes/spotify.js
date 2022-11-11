const express = require('express');
const router = express.Router();
const axios = require('axios');
const scrape = require('../scrape');
const getArtistStats = require('../getArtistStats');

router.get('/getfollowed', (req, res) => {
    // res.render('map');
    let accessToken = req.user.accessToken;
    console.log('ACCESS TOKEN: ', accessToken);
    getFollowedArtists(accessToken).then((followedArtists) => {
        console.log(followedArtists.length);
        // console.log(followedArtists[0]);
        // res.json(followedArtists);
        res.render('getfollowed.ejs', { followedArtists });
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

router.get('/mapartist', (req, res) => {
    console.log(req.query);
    let artistUrl = 'https://open.spotify.com/artist/' + req.query.artist;
    getArtistStats(artistUrl).then((artistStats) => {
        // console.log(JSON.stringify(artistStats.topCities));
        // res.json(artistStats);
        res.render('map.ejs', {
            topCities: JSON.stringify(artistStats.topCities),
        });
    });
});

router.get('/maptest', (req, res) => {
    console.log('MAP TEST');

    // const dummystats = JSON.parse(
    //     '{ "Followers": 38661243, "MonthlyListeners": 51021897, "topCities": { "type": "FeatureCollection", "features": [ { "type": "Feature", "geometry": { "type": "Point", "coordinates": [-0.12764739999999997, 51.507321899999994] }, "properties": { "city": "London, GB", "listeners": 1126607 } }, { "type": "Feature", "geometry": { "type": "Point", "coordinates": [-118.242766, 34.053691] }, "properties": { "city": "Los Angeles, US", "listeners": 836232 } }, { "type": "Feature", "geometry": { "type": "Point", "coordinates": [151.21, -33.868] }, "properties": { "city": "Sydney, AU", "listeners": 803698 } }, { "type": "Feature", "geometry": { "type": "Point", "coordinates": [-87.624421, 41.875562] }, "properties": { "city": "Chicago, US", "listeners": 744136 } }, { "type": "Feature", "geometry": { "type": "Point", "coordinates": [-96.80433099999999, 32.864527] }, "properties": { "city": "Dallas, US", "listeners": 644563 } } ] } }'
    // );
    const dummystats2 = JSON.parse(
        '{"Followers":38661243,"MonthlyListeners":50952635,"topCities":{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Point","coordinates":[-0.12764739999999997,51.507321899999994]},"properties":{"city":"London, GB","listeners":1125142}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-118.242766,34.053691]},"properties":{"city":"Los Angeles, US","listeners":843605}},{"type":"Feature","geometry":{"type":"Point","coordinates":[151.21,-33.868]},"properties":{"city":"Sydney, AU","listeners":801436}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-87.624421,41.875562]},"properties":{"city":"Chicago, US","listeners":741454}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-96.80433099999999,32.864527]},"properties":{"city":"Dallas, US","listeners":642921}}]}}'
    );

    res.render('map.ejs', {
        topCities: JSON.stringify(dummystats2.topCities),
        // topCities: dummystats.topCities
    });
});

module.exports = router;
