const cheerio = require('cheerio');

const Downloader = require('./Downloader');

const SequentialDownloader = {
    SequentialDownloader(baseUri, onProgress) {
        this.baseUri = baseUri;
        this.Downloader = Object.create(Downloader);
        this.Downloader.Downloader(this.baseUri);
        this.onProgress = onProgress;
        this.results = [];
    },
    async downloadAll() {
        let page = '';
        const results = [];

        do {
            page = await this.Downloader.next();

            this.onProgress(page);

            this.results.push(page);
        } while (this.hasNext(page));

        return results;
    },
    hasNext(page) {
        const $ = cheerio.load(page);

        return $('a.nextlink').length == 1;
    }
}

module.exports = SequentialDownloader;
