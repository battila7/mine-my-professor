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
    downloadAll() {
        const done = new Promise(resolve => this.resolve = resolve);

        this.downloadNext();

        return done;
    },
    async downloadNext() {
        const downloadResult = await this.Downloader.next();

        onProgress(downloadResult)

        this.results.push(downloadResult.page);

        if (!hasNext) {
            this.resolve(this.results);
        } else {
            this.downloadNext();
        }
    },
    hasNext(page) {
        const $ = cheerio.load(page);

        return $('a.nextlink').length == 1;
    }
}
