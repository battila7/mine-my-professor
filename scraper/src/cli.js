const argv = require('yargs')
    .describe('schoolName', 'The name of the school to be scraped.')
    .describe('schoolId', 'The ID of the school to be scraped.')
    .describe('output', 'Path to the output file.')
    .describe('batchSize', 'The number of parallel teacher downloads.')
    .default('batchSize', 5)
    .alias('o', 'output')
    .describe('pretty', 'Pretty-print the otuput.')
    .default('pretty', false)
    .demandOption([ 'schoolName', 'schoolId', 'output' ])
    .help('h')
    .alias('h', 'help')
    .argv

const options = {
    school: {
        id: argv.schoolId,
        name: argv.schoolName
    },
    outputPath: argv.output,
    teacherBatchSize: argv.batchSize,
    prettyPrint: argv.pretty
};

module.exports = options;
