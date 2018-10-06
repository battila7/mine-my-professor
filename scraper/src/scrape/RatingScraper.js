const { ratingNames } = require('./Ratings');

function scrape($, $rows) {
    // Each rating consists of 5 tr elements. However, there is an
    // unneeded ending tr at the end of the table.
    const ratingCount = Math.floor($rows.length / 5);

    return [...Array(ratingCount).keys()].map(index => {
        const $ratingRow = $rows[index * 5 + 1];
        const $commentRow = $rows[index * 5 + 2];

        return scrapeDetails($, $ratingRow, $commentRow);
    });
}

function scrapeDetails($, $ratingRow, $commentRow) {
    return {
        ratings: scrapeRatings($, $ratingRow),
        comment: scrapeComment($, $commentRow),
        course: scrapeCourse($, $commentRow)
    };
}

/*
 * Example element to be scraped:
 *   <tr class="noborder backgrounded" >
 *       <td colspan="6">
 *           <div class="message">
 *               <span class="capital infotool" name="Regisztrált felhasználó hozzászólása">
 *                  <img src="/images/regged-user.png" alt="" align="right" />
 *               </span>
 *               <strong>COURSE</strong><br />
 *               
 *                   
 *                   COMMENT
 *               
 *           </div>
 *       </td>
 *  </tr>
 */
function scrapeComment($, $commentRow) {
    try {
        return $('br', $commentRow)[0].next.data.trim();
    } catch {
        return '';
    }
}

function scrapeCourse($, $commentRow) {
    try {
        return $('strong', $commentRow)[0].firstChild.data;
    } catch {
        return '';
    }
}

/*
 * Example element to be scraped:
 *   <tr class="noborder values">
 *       <td align="center"><strong class="big-font3">5</strong></td>
 *       <td align="center"><strong class="big-font3">4</strong></td>
 *       <td align="center"><strong class="big-font3">4</strong></td>
 *       <td align="center"><strong class="big-font3">5</strong></td>
 *       <td align="center"><strong class="big-font3">5</strong></td>
 *       <td align="center" valign="middle"><img src="/images/sexy-middle.png" alt="" /></td>
 *   </tr>
 */
function scrapeRatings($, $ratingRow) {
    const ratings = {};

    $('strong.big-font3', $ratingRow).each(function scrapeRating(index) {
        ratings[ratingNames[index]] = Number.parseInt(this.firstChild.data);
    });

    return ratings;
}

module.exports = {
    scrape
};
