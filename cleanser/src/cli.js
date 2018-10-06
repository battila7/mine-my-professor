const argv = require('yargs')
    .describe('input', 'Path to the input file.')
    .alias('i', 'input')
    .describe('mergeTeacherRules', 'Path to the teacher merging rules file.')
    .describe('mergeTeacherOutput', 'Path to the merged teacher output file.')
    .describe('mergeCourseRules', 'Path to the course merging rules file.')
    .describe('mergeCourseOutput', 'Path to the merged subject output file.')
    .describe('denormalizeOutput', 'Path to the denormalized output file.')
    .describe('pretty', 'Pretty-print the otuput.')
    .default('pretty', false)
    .demandOption([ 'input' ])
    .help('h')
    .alias('h', 'help')
    .argv

const options = {
    inputPath: argv.input,
    pipeline: {
        stages: {
            mergeTeacher: {
                outputPath: argv.mergeTeacherOutput,
                rulesPath: argv.mergeTeacherRules
            },
            mergeCourse: {
                outputPath: argv.mergeCourseOutput,
                rulesPath: argv.mergeCourseRules
            },
            denormalize: {
                outputPath: argv.denormalizeOutput
            }
        }
    },
    prettyPrint: argv.pretty
};

module.exports = options;
