const cheerio = require('cheerio');

const SequentialDownloader = {
    SequentialDownloader(onProgress, downloader) {
        this.downloader = downloader;
        this.onProgress = onProgress;
        this.results = [];
    },
    async downloadAll() {
        let page = '';
        const results = [];

        do {
            page = await this.downloader.next();

            this.onProgress(page);

            this.results.push(page);
        } while (this.hasNext(page.contents));

        return results;
    },
    hasNext(contents) {
        const $ = cheerio.load(contents);

        return $('a.nextlink').length == 1;
    }
}

module.exports = SequentialDownloader;
