const SequentialDownloader = require('../download/SequentialDownloader');

const Miner = {
    Miner(baseUri) {
        this.baseUri = baseUri;

        this.downloader = Object.create(SequentialDownloader);
        this.downloader.SequentialDownloader(this.baseUri, this.downloaderOnProgress.bind(this));
    },
    mine() {
        return this.downloader.downloadAll()
            .then(results => this.downloaderOnCompleted(results));
    }
};

module.exports = Miner;
