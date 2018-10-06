const cheerio = require('cheerio');

const { ratingNames } = require('./Ratings');

const RatingScraper = require('./RatingScraper');

function scrape(contents) {
    const $ = cheerio.load(contents);

    return {
        overallQuality: scrapeOverallQuality($),
        overallRatings: scrapeOverallRatings($),
        courses: scrapeCourses($),
        ratings: scrapeRatings($)
    };
}

/*
 * Example element to be scraped:
 * <div class="Overall_quality">
 *  <span class="label">Átlag</span><br />
 *  <span class="big-font7">OVERALL QUALITY</span>
 * </div>
 */
function scrapeOverallQuality($) {
    return Number.parseFloat($('span.big-font7', 'div.Overall_quality').text());
}

/*
 * Example element to be scraped:
 * <div class="rate-holder">
 *   <table width="100%">
 *     <tr>
 *       <td><span class="label">Követelmények teljesíthetősége</span></td><td align="right"><span class="label">REQUIREMENTS</span></td>
 *     </tr>
 *     <tr>
 *      <td><span class="label">Tárgy hasznossága</span></td><td align="right"><span class="label">USEFUL</span></td>
 *     </tr>
 *     <tr>
 *       <td><span class="label">Segítőkészség</span></td><td align="right"><span class="label">HELPFUL</span></td>
 *     </tr>
 *     <tr>
 *       <td><span class="label">Felkészültség</span></td><td align="right"><span class="label">PREPARED</span></td>
 *     </tr>
 *     <tr>
 *       <td><span class="label">Előadásmód</span></td><td align="right"><span class="label">DICTION</span></td>
 *     </tr>
 *     <tr>
 *       <td><span class="label">Szexi</span></td><td align="right" valign="middle"></td>
 *     </tr>
 *   </table>
 *   <span class="label">Tanított tárgyak</span><br/>
 *   <span class="big-font2">COURSES</span><br/>
 * </div>
 */
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

    try {
        const coursesText = $coursesLabelSpan.next.next.next.firstChild.data;

        return coursesText.split(',').map(str => str.trim());
    } catch (err) {
        return [];
    }
}

/*
 * Example element to be scraped:
 * <dl class="simpleList">
 *   <dt>Értékelések <span>Összes értékelés: 26</span></dt>
 *   <dd>
 *     <a id="rates" name="rates"></a>
 *     <table class="">
 *       <thead class="padded">
 *       </thead>
 *       <tbody>
 *         RATING ROWS
 *       </tbody>
 *     </table>
 *   </dd>
 * </dl>
 */
function scrapeRatings($) {
    const $ratingsTable = $('tbody', 'dl');

    const $rows = $('tr', $ratingsTable);

    return RatingScraper.scrape($, $rows);
}

module.exports = {
    scrape
};
