const argv = require('yargs')
    .describe('schoolName', 'The name of the school to be scraped.')
    .describe('schoolId', 'The ID of the school to be scraped.')
    .describe('datasetOutput', 'Path to the dataset output file.')
    .describe('schoolOutput', 'Path to the school entry output file.')
    .describe('batchSize', 'The number of parallel teacher downloads.')
    .default('batchSize', 5)
    .describe('pretty', 'Pretty-print the otuput.')
    .default('pretty', false)
    .demandOption([ 'schoolName', 'schoolId', 'datasetOutput' ])
    .help('h')
    .alias('h', 'help')
    .argv

const options = {
    school: {
        id: argv.schoolId,
        name: argv.schoolName
    },
    datasetOutputPath: argv.datasetOutput,
    schoolOutputPath: argv.schoolOutput,
    teacherBatchSize: argv.batchSize,
    prettyPrint: argv.pretty
};

module.exports = options;
