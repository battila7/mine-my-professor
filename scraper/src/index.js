const { writeFileSync } = require('fs');
const leadMiner = require('./leadMiner');

const options = require('./cli');

(async function mineMyProfessor(options) {
    const printer = options.prettyPrint ? prettyPrinter : rawPrinter;

    const schoolData = await mineSchool(options.school);

    if (options.schoolOutputPath) {
        writeFileSync(options.schoolOutputPath, printer(schoolData));
    }

    const teacherData = await mineTeachers(options.teacherBatchSize, schoolData.teachers);

    const dataset = {
        name: options.school.name,
        id: options.school.id,
        teachers: teacherData
    };

    writeFileSync(options.datasetOutputPath, printer(dataset));
})(options);

function rawPrinter(data) {
    return JSON.stringify(data);
}

function prettyPrinter(data) {
    return JSON.stringify(data, null, 4);
}

async function mineSchool(school) {
    console.log('Collecting teacher data...');
    const schoolData = await leadMiner.mineSchool(school);
    console.log(`${schoolData.teachers.length} teacher entries collected.`);

    return schoolData;
}

function mineTeachers(teacherBatchSize, entries) {
    return leadMiner.mineTeachers(teacherBatchSize, entries);
}

process.on('unhandledRejection', err => console.log(err));
