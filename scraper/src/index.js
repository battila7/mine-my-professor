const { writeFileSync } = require('fs');
const { mineSchool, mineTeachers } = require('leadMiner.js');

const options = require('./cli');

(async function mineMyProfessor(options) {
    const dataset = await mineDataset(options);

    let outputString;
    if (options.prettyPrint) {
        outputString = JSON.stringify(dataset, null, 4);
    }  else {
        outputString = JSON.stringify(dataset);
    }

    writeFileSync(options.outputPath, outputString);
})(options);

async function mineDataset({ school, teacherBatchSize }) {
    console.log('Collecting teacher data...');
    const schoolData = await mineSchool(options.school);
    console.log(`${schoolData.teachers.length} teacher entries collected.`);

    const teacherData = await mineTeachers(teacherBatchSize, schoolData.teachers);

    return {
        name: school.name,
        id: school.id,
        teachers: teacherData
    };
}

process.on('unhandledRejection', err => console.log(err));
