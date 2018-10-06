const cheerio = require('cheerio');

const URI_ID_PATTERN = /\/tanar\/adatlap\/(\d+)\.html/;

function scrape(contents) {
    const $ = cheerio.load(contents);

    const teachers = [];

    // Links to the teachers' pages are contained within a table.
    $('a', 'tbody.results').each(function scrapeAnchor() {
        const href = $(this).attr('href');

        // However, for each teacher, there are two links. We only need one.
        if (!href.startsWith('/oldalajanlo')) {
            const id = extractIdFromUri(href);

            if (id) {
                teachers.push({
                    id,
                    name: this.firstChild.data.trim()
                });
            }
        }
    });

    return teachers;
}

function extractIdFromUri(uri) {
    const results = URI_ID_PATTERN.exec(uri);

    if (!results) {
        return null;
    } else {
        return results[1];
    }
}

module.exports = {
    scrape
};
