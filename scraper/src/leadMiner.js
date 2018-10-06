const SchoolMiner = require('./mine/SchoolMiner');
const TeacherMiner = require('./mine/TeacherMiner');

function mineSchool({ name, id }) {
    const schoolMiner = Object.create(SchoolMiner);
    schoolMiner.SchoolMiner(name, id);

    return schoolMiner.mine();
}

async function mineTeachers(batchSize, entries) {
    const results = [];

    for (let i = 0; i < entries.length; i += batchSize) {
        const endIndex = Math.min(entries.length, i + batchSize);

        const batch = entries.slice(i, endIndex);

        console.log(`Loading batch ${i + 1}-${endIndex}`);
        const teacherMessage = batch
            .map(({ name, id }) => `\t${name} (${id})`)
            .join('\n');
        console.log(teacherMessage);

        const batchMinePromises = batch.map(({ name, id }) => {
            const miner = Object.create(TeacherMiner);
            miner.TeacherMiner(name, id);

            return miner.mine()
                .then(data => results.push(data));
        });

        await Promise.all(batchMinePromises);
    }

    return results;
};

module.exports = {
    mineSchool,
    mineTeachers
};
