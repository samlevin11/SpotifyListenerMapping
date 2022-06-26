const puppeteer = require('puppeteer');
require('dotenv').config();

async function start(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url);

    // Place futher page processing works within setTimeout, minimum timout 2 seconds
    setTimeout(async () => {
        // // Click the artist info button based on class
        const artistInfoClass = process.env.ARTIST_INFO_CLASS;
        await page.click(artistInfoClass);

        // Object to store stats about an artist
        const artistStats = {};

        // Get the overall stats by class (Followers, Monthly Listeners)
        // Return innerText with unformatted stats of interest
        const overallStatsClass = process.env.OVERALL_STATS_CLASS;
        const overallStats = await page.$$eval(
            overallStatsClass,
            (elements) => {
                return elements.map((el) => el.innerText);
            }
        );
        // console.log('overallStats', overallStats);

        // For each overall stat
        overallStats.forEach((s) => {
            // Split description and number, save to variables
            const [count, overallStat] = s.split('\n');
            // Format these strings and add to artistStats object
            artistStats[overallStat.replace(' ', '')] = parseInt(
                count.replace(',', '')
            );
        });

        // Get the top cities by class
        const topCitiesClass = process.env.TOP_CITIES_CLASS;
        const topCities = await page.$$eval(topCitiesClass, (elements) => {
            return elements.map((el) => el.innerText);
        });
        // console.log('topCities', topCities);

        // For each top city
        topCitiesFormatted = topCities.map((c) => {
            const [city, listeners] = c.split('\n');
            // Format these strings
            return {
                city,
                listeners: parseInt(
                    listeners.replace(' listeners', '').replace(',', '')
                ),
            };
        });
        // console.log('topCitiesFormatted', topCitiesFormatted);

        artistStats.topCities = topCitiesFormatted;

        console.log('artistStats', artistStats);

        await browser.close();

        return artistStats;
    }, 2001);
}