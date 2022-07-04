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

    const geocodeResult = await axios(config);
    return geocodeResult.data.features[0].center;
}

module.exports = geocodeCity;

// const cities = ['Dallas, US', 'London, UK', 'Sydney, AU', 'Berlin, DE', 'Mexico City, MX']
// let cityGeocodes = cities.map((city) => geocodeCity(city))
// Promise.all(cityGeocodes).then((results) => {
//     console.log(results)
// })
