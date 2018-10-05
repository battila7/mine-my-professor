const cheerio = require('cheerio');

const { ratingNames } = require('./Ratings');

const RatingScraper = require('./RatingScraper');

function scrapeOverallQuality($) {
    return Number.parseFloat($('span.big-font7', 'div.Overall_quality').text());
}

function scrapeOverallRatings($) {
    const $ratingTable = $('tbody', '.rate-holder');

    const ratings = {};

    $('tr', $ratingTable).each(function scrapeRatings(index) {
        if (index < ratingNames.length) {
            const $ratingSpan = $('span', this)[1];

            ratings[ratingNames[index]] = Number.parseFloat($ratingSpan.firstChild.data);
        }
    });

    return ratings;
}

function scrapeCourses($) {
    const $coursesLabelSpan = $('span.label').filter(function coursesFilter() {
        const firstChild = this.firstChild;

        if (!firstChild) {
            return false;
        }

        if (firstChild.type == 'text' && firstChild.data == 'Tanított tárgyak') {
            return true;
        }

        return false;
    })[0];

    const coursesText = $coursesLabelSpan.next.next.next.firstChild.data;

    return coursesText.split(',').map(str => str.trim());
}

function scrapeRatings($) {
    const $ratingsTable = $('tbody', 'dl');

    const $rows = $('tr', $ratingsTable);

    return RatingScraper($, $rows);
}

module.exports = function scrape(contents) {
    const $ = cheerio.load(contents);

    return {
        overallQuality: scrapeOverallQuality($),
        overallRatings: scrapeOverallRatings($),
        courses: scrapeCourses($),
        ratings: scrapeRatings($)
    };
}
