require('dotenv').config();
const axios = require('axios');
const res = require('express/lib/response');

mapbox_token = process.env.MAPBOX_TOKEN;

function geocodeCity(city) {
    const cityFormatted = city.split(', ').join('%20');

    var config = {
        method: 'get',
        url: `https://api.mapbox.com/geocoding/v5/mapbox.places/${cityFormatted}.json?language=en&type=place&limit=1&access_token=${mapbox_token}`,
        headers: {},
    };

    return axios(config);
}

geocodeCity('Chicago, US').then((response) => {
    if (response.status === 200) {
        // console.log('response data', response.data);
        console.log(response.data.features[0].center)
    } else {
        console.log('Geocode Error');
    }
});
