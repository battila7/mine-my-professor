const { ratingNames } = require('./Ratings');

function scrapeComment($, $commentRow) {
    return $('br', $commentRow)[0].next.data.trim();
}

function scrapeCourse($, $commentRow) {
    return $('strong', $commentRow)[0].firstChild.data;
}

function scrapeRatings($, $ratingRow) {
    const ratings = {};

    $('strong.big-font3', $ratingRow).each(function scrapeRating(index) {
        ratings[ratingNames[index]] = Number.parseInt(this.firstChild.data);
    });

    return ratings;
}

function scrapeDetails($, $ratingRow, $commentRow) {
    return {
        ratings: scrapeRatings($, $ratingRow),
        comment: scrapeComment($, $commentRow),
        course: scrapeCourse($, $commentRow)
    };
}

module.exports = function scrape($, $rows) {
    const ratingCount = Math.floor($rows.length / 5);

    return [...Array(ratingCount).keys()].map(index => {
        const $ratingRow = $rows[index * 5 + 1];
        const $commentRow = $rows[index * 5 + 2];

        return scrapeDetails($, $ratingRow, $commentRow);
    });
}
