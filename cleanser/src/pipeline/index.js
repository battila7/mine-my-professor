const stages = [
    'removePrefix',
    'mergeTeacher'
];

function process(options, initialDataset) {
    const stageFunctions = stages.map(name => executeStage.bind(null, name, options.environment, options.stages[name]));

    return stageFunctions.reduce(
        (promise, stageFn) => promise.then(resultDataset => stageFn(resultDataset)),
        Promise.resolve(initialDataset));
};

function executeStage(stageName, environment, stageOptions, dataset) {
    const stage = require(`./${stageName}`);

    return stage.process(environment, stageOptions, dataset)
}

module.exports = {
    process
};
