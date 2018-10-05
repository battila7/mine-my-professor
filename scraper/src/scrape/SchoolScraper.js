const cheerio = require('cheerio');

const uriIdPattern = /\/tanar\/adatlap\/(\d+)\.html/g;

function extractId(uri) {
    const results = uriIdPattern.exec(uri);

    if (!results) {
        return null;
    } else {
        return results[1];
    }
}

module.exports = function scrape(contents) {
    const $ = cheerio.load(contents);

    const teachers = [];

    $('a', 'tbody.results').each(function scrapeAnchor() {
        const href = $(this).attr('href');

        if (!href.startsWith('/oldalajanlo')) {
            const id = extractId(uri);

            if (id) {
                teachers.push({
                    id,
                    name
                });
            }
        }
    });

    return teachers;
}
