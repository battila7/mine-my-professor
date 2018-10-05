const SequentialDownloader = require('../download/SequentialDownloader')
const SchoolScraper = require('../scrape/SchoolScraper');

const SchoolMiner = {
    SchoolMiner(name, id, onProgress) {
        this.name = name;
        this.id = id;
        this.onProgress = onProgress;

        this.downloader = Object.create(SequentialDownloader);
        this.downloader.SequentialDownloader(`http://www.markmyprofessor.com/iskola/adatlap/${this.id}.html`, this.downloaderOnProgress);

        this.data = {
            name,
            id,
            teachers = []
        };
    },
    mine() {
        return this.downloader.downloadAll()
            .then(this.data);
    },
    downloaderOnProgress(page) {
        const scrapingResults = SchoolScraper(page);

        this.data.teachers = this.data.teachers.concat(scrapingResults);
    }
};

module.exports = SchoolMiner;
