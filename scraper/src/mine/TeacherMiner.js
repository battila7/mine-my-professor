const SequentialDownloader = require('../download/SequentialDownloader')
const TeacherScraper = require('../scrape/TeacherScraper');

const TeacherMiner = {
    TeacherMiner(name, id, onProgress) {
        this.name = name;
        this.id = id;
        this.onProgress = onProgress;

        this.downloader = Object.create(SequentialDownloader);
        this.downloader.SequentialDownloader(`http://www.markmyprofessor.com/tanar/adatlap/${this.id}.html`, this.downloaderOnProgress);

        this.data = {
            name,
            id,
            ratings: []
        };
    },
    mine() {
        return this.downloader.downloadAll()
            .then(this.data);
    },
    downloaderOnProgress(page) {
        const scrapingResults = TeacherScraper(page);

        if (!this.data.overall) {
            this.data.overall = {
                quality: scrapingResults.overallQuality,
                ratings: scrapingResults.overallRatings,
                courses: scrapingResults.courses
            };
        }

        this.data.ratings = this.data.ratings.concat(scrapingResults.ratings);
    }
};

module.exports = TeacherMiner;
