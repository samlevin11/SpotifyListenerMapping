const scrape = require('./scrape');
const geocode = require('./geocode');

async function getArtistStats(artistUrl) {
    console.log(artistUrl);

    let artistStats = await scrape(artistUrl);
    // Dummy artistStats for testing
    // let artistStats = {
    //     Followers: 240949,
    //     MonthlyListeners: 355397,
    //     topCities: [
    //         { city: 'London, GB', listeners: 5702 },
    //         { city: 'Los Angeles, US', listeners: 5626 },
    //         { city: 'Melbourne, AU', listeners: 5146 },
    //         { city: 'Istanbul, TR', listeners: 4549 },
    //         { city: 'Sydney, AU', listeners: 4431 },
    //     ],
    // };

    // Geocode top cities
    // Add coordiantes as an attribute in each city object
    // Wait for all five cities to finish being geocoded before reassigining the topCities property
    artistStats.topCities = await Promise.all(
        artistStats.topCities.map(async (c) => {
            // Geocode via Mapbox geocoding service
            // Assign a new coordinates property to the city object with the geocoded long, lat
            // c.coordinates = await geocode(c.city);
            // return the new city object with coodinate attribute

            let coordiantes = await geocode.geocodeCity(c.city);
            // Return city formatted as GeoJSON
            return geocode.cityToGeoJSON(c, coordiantes);
        })
    );

    // console.log(artistStats)

    // Return artists stats with geocoded top cities
    // Each top city formatted as GeoJSON
    return artistStats;
}

module.exports = getArtistStats;
