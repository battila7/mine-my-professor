const Miner = require('./Miner');
const TeacherScraper = require('../scrape/TeacherScraper');

const TeacherMiner = {
    TeacherMiner(name, id) {
        this.Miner(`http://www.markmyprofessor.com/tanar/adatlap/${id}.html`);

        this.name = name;
        this.id = id;

        this.data = {
            name,
            id,
            ratings: []
        };
    },
    downloaderOnCompleted() {
        return this.data;
    },
    downloaderOnProgress(page) {
        const scrapingResults = TeacherScraper.scrape(page.contents);

        if (!this.data.overall) {
            this.data.overall = {
                quality: scrapingResults.overallQuality,
                ratings: scrapingResults.overallRatings,
                courses: scrapingResults.courses
            };
        }

        this.data.ratings = this.data.ratings.concat(scrapingResults.ratings);
    },

};

Object.setPrototypeOf(TeacherMiner, Miner);

module.exports = TeacherMiner;
