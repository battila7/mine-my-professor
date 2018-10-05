const AxiosDownloader = require('../download/AxiosDownloader');
const SequentialDownloader = require('../download/SequentialDownloader')
const SchoolScraper = require('../scrape/SchoolScraper');

const SchoolMiner = {
    SchoolMiner(name, id, onProgress) {
        this.name = name;
        this.id = id;
        this.onProgress = onProgress;

        const ad = Object.create(AxiosDownloader);
        ad.Downloader(`http://www.markmyprofessor.com/iskola/adatlap/${this.id}.html`)

        this.downloader = Object.create(SequentialDownloader);
        this.downloader.SequentialDownloader(this.downloaderOnProgress.bind(this), ad);

        this.data = {
            name,
            id,
            teachers: []
        };
    },
    mine() {
        return this.downloader.downloadAll()
            .then(() => this.data);
    },
    downloaderOnProgress(page) {
        console.log(page.index);
        const scrapingResults = SchoolScraper(page.contents);

        this.data.teachers = this.data.teachers.concat(scrapingResults);
    }
};

module.exports = SchoolMiner;
