const Miner = require('./Miner');
const SchoolScraper = require('../scrape/SchoolScraper');

const SchoolMiner = {
    SchoolMiner(name, id) {
        this.Miner(`http://www.markmyprofessor.com/iskola/adatlap/${id}.html`)
        this.name = name;
        this.id = id;

        this.data = {
            name,
            id,
            teachers: []
        };
    },
    downloaderOnCompleted() {
        return this.data;
    },
    downloaderOnProgress(page) {
        const scrapingResults = SchoolScraper.scrape(page.contents);

        this.data.teachers = this.data.teachers.concat(scrapingResults);
    }
};

Object.setPrototypeOf(SchoolMiner, Miner);

module.exports = SchoolMiner;
