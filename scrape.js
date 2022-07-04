const { response } = require('express');
const puppeteer = require('puppeteer');
require('dotenv').config();

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

async function scrape(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url);

    // Results is a Promise that will resolve once all statistics have been gathered
    const results = await new Promise((resolve, reject) => {
        // Place futher page processing works within setTimeout, minimum timout 2 seconds
        setTimeout(async () => {
            // // Click the artist info button based on class
            const artistInfoClass = process.env.ARTIST_INFO_CLASS;
            await page.$eval(artistInfoClass, (element) => element.click());

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

            // console.log('artistStats', artistStats);

            // Close browser, terminates puppeteer process
            await browser.close();

            // Resolve promise with artist stats
            resolve(artistStats);
        }, getRandomInt(2000, 4000));
    });

    // Return Promise of artist stats
    return results;
}

// scrape('url').then((response) => {
//     console.log('response', response)
// })

module.exports = scrape