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
    // console.log(artistStats);

    // Geocode top cities
    // Add coordiantes as an attribute in each city object
    // Wait for all five cities to finish being geocoded before reassigining the topCities property
    artistStats.topCities = await Promise.all(
        artistStats.topCities.map(async (c) => {
            // Geocode via Mapbox geocoding service
            // Wait for result
            let cityGeocode = await geocode(c.city);
            // Assign a new coordinates property to the city object with the geocoded long, lat
            c.coordinates = cityGeocode.data.features[0].center;
            // return the new city object with coodinate attribute
            return c;
        })
    );

    console.log(artistStats);
}
