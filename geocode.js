require('dotenv').config();
const axios = require('axios');

mapbox_token = process.env.MAPBOX_TOKEN;

async function geocodeCity(city) {
    const cityFormatted = city.split(', ').join('%20');

    var config = {
        method: 'get',
        url: `https://api.mapbox.com/geocoding/v5/mapbox.places/${cityFormatted}.json?language=en&type=place&limit=1&access_token=${mapbox_token}`,
        headers: {},
    };

    axios(config)
        .then((response) => {
            console.log('Geocode success')
            console.log(JSON.stringify(response.data));
            return response
        })
        .catch((error) => {
            console.log('ERROR', error);
        });
}

geocodeCity('Chicago, US')
