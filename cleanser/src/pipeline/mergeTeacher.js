function process({ read, write },  { rulesPath, outputPath }, initialDataset) {
    const rules = read(rulesPath);

    let mergedTeachers = createMergedTeachers(rules, initialDataset.teachers);

    mergedTeachers = recalculateOverallRatings(mergedTeachers);

    const outputDataset = {
        name: initialDataset.name,
        id: initialDataset.id,
        teachers: mergedTeachers
    };

    if (outputPath) {
        write(outputPath, outputDataset);
    }
    
    return outputDataset;
};

function createMergedTeachers(rules, teachers) {
    const result = Object.create(null);

    rules.forEach(rule => {
        result[rule.mergeId] = {
            name: rule.mergeName,
            id: rule.mergeId,
            courses: [],
            ratings: []
        };
    });

    teachers.forEach(teacher => {
        const rule = getRuleForId(rules, teacher.id);

        if (!rule) {
            result[teacher.id] = teacher
        } else {
            result[rule.mergeId].ratings = result[rule.mergeId].ratings.concat(teacher.ratings); 
        }
    });
    
    return result;
}

function recalculateOverallRatings(teachers) {
    Object.keys(teachers).map(id => {
        if (!teachers[id].overall) {
            calculateOverallRatingOfTeacher(teachers[id]);
        }
    });

    return teachers;
}

function calculateOverallRatingOfTeacher(teacher) {
    const ratings = {
        requirements: 0,
        useful: 0,
        prepared: 0,
        helpful: 0,
        diction: 0
    };

    if (teacher.ratings.length == 0) {
        return teacher;
    }

    teacher.ratings.forEach(rating => {
        Object.keys(ratings).forEach(category => {
            ratings[category] += rating.ratings[category];
        });
    });

    Object.keys(ratings).forEach(category => {
        ratings[category] = ratings[category] / teacher.ratings.length; 
    });

    const quality = Object.values(ratings)
        .reduce((acc, curr) => acc + curr, 0) / 5;

    teacher.overall = {
        ratings,
        quality
    };

    return teacher;
}

function getRuleForId(rules, id) {
    return rules.find(rule => rule.ids.includes(id));
}

module.exports = {
    process
};
