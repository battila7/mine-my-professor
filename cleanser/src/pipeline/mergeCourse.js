function process({ read, write },  { rulesPath, outputPath }, initialDataset) {
    const rules = read(rulesPath);

    let mergedTeachers = createMergedTeachers(rules, initialDataset.teachers);

    mergedTeachers = recalculateCourses(mergedTeachers);

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
    Object.values(teachers)
        .forEach(teacher => processRatings(rules, teacher.ratings));

    return teachers;
}

function recalculateCourses(teachers) {
    Object.values(teachers)
        .forEach(teacher => {
            teacher.overall = Object.assign({}, teacher.overall, { courses: uniqueCoursesForTeacher(teacher) });
        });

    return teachers;
}

function processRatings(rules, ratings) {
    ratings.forEach(rating => {
        rating.course = rating.course.trim();

        const rule = getRuleForCourse(rules, rating.course);

        if (rule) {
            rating.course = rule.mergeName
        }
    })
}

function getRuleForCourse(rules, course) {
    return rules.find(rule => rule.names.includes(course));
}

function uniqueCoursesForTeacher(teacher) {
    const set = new Set(teacher.ratings.map(rating => rating.course));

    return Array.from(set);
}

module.exports = {
    process
};
