const cheerio = require('cheerio');

const { get } = require('./Downloader');

const FORWARD_LINK_SELECTOR = 'a.nextlink';

const SequentialDownloader = {
    SequentialDownloader(baseUri, onProgress) {
        this.baseUri = baseUri;
        this.onProgress = onProgress;

        this.lastIndex = 0;
    },
    async downloadAll() {
        let page = '';
        const results = [];

        do {
            page = await get(this.nextUri());

            this.onProgress(page);

            results.push(page);
        } while (this.hasNext(page.contents));

        return results;
    },
    hasNext(contents) {
        const $ = cheerio.load(contents);

        return $(FORWARD_LINK_SELECTOR).length == 1;
    },
    nextUri() {
        this.lastIndex++;

        if (this.lastIndex == 1) {
            return this.baseUri;
        } else {
            return `${this.baseUri}?p=${this.lastIndex}`;
        }
    }
}

module.exports = SequentialDownloader;
