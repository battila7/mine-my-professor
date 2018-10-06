function process({ write }, { outputPath }, initialDataset) {
    const schoolData = {
        schoolName: initialDataset.name,
        schoolId: initialDataset.id
    };

    const outputDataset = Object.values(initialDataset.teachers)
        .map(denormalizeTeacher)
        .reduce((acc, curr) => acc.concat(curr), [])
        .map(entry => Object.assign({}, schoolData, entry));

    if (outputPath) {
        write(outputPath, outputDataset);
    }

    return outputDataset;
};

function denormalizeTeacher(teacher) {
    return teacher.ratings.map(rating => {
        const teacherData = {
            teacherId: teacher.id,
            teacherName: teacher.name
        };

        const entry = Object.assign({}, rating);

        delete entry.ratings;

        return Object.assign({}, teacherData, entry, rating.ratings);
    })
}

module.exports = {
    process
};
