const SchoolMiner = require('./mine/SchoolMiner');
const TeacherMiner = require('./mine/TeacherMiner');

const argv = require('yargs')

const DEIK = 'DE IK';
const DEIK_ID = 39;

const TEACHER_BATCH_SIZE = 5;

function mineDEIK() {
    const schoolMiner = Object.create(SchoolMiner);
    schoolMiner.SchoolMiner(DEIK, DEIK_ID);

    return schoolMiner.mine();
}

async function mineTeachers(entries) {
    const results = [];

    for (let i = 0; i < entries.length; i += TEACHER_BATCH_SIZE) {
        const endIndex = Math.min(entries.length, i + TEACHER_BATCH_SIZE);

        const batch = entries.slice(i, endIndex);

        const batchMinePromises = batch.map(({name, id}) => {
            const miner = Object.create(TeacherMiner);
            miner.TeacherMiner(name, id);

            return miner.mine()
                .then(data => results.push(data));
        });

        await Promise.all(batchMinePromises);

        console.log(`Loaded batch ${i + 1}-${endIndex + 1}`);
    }

    return results;
};

(async function mineMyProfessor() {
    console.log('Collecting teacher data...');

    const deikData = await mineDEIK();
    writeFileSync('./deik.json', JSON.stringify(deikData, null, 4));

    console.log(`${deikData.teachers.length} entries collected.`);
    
    const data = await mineTeachers(deikData.teachers);
    writeFileSync("./dataset.json", JSON.stringify(data));
    writeFileSync('./formatted.json', JSON.stringify(data, null, 4));
})();

process.on('unhandledRejection', err => console.log(err));
