const { readFileSync, writeFileSync } = require('fs');

const options = require('./cli');

const pipeline = require('./pipeline');

(function cleanser(options) {
    const printer = options.prettyPrint ? prettyPrinter : rawPrinter;

    const fileWriter = (path, data) => writeFileSync(path, printer(data));
    const fileReader = path => JSON.parse(readFileSync(path).toString());

    const dataset = fileReader(options.inputPath);

    const pipelineOptions = {
        environment: {
            write: fileWriter,
            read: fileReader
        },
        stages: options.pipeline.stages
    };

    pipeline.process(pipelineOptions, dataset);
})(options);

function rawPrinter(data) {
    return JSON.stringify(data);
}

function prettyPrinter(data) {
    return JSON.stringify(data, null, 4);
}
