const PREFIXES = ['dr', 'dr.', 'habil', 'habil.', 'prof', 'prof.']

function process(environment,  options, initialDataset) {
    return {
        name: initialDataset.name,
        id: initialDataset.id,
        teachers: initialDataset.teachers.map(prefixRemover)
    };
};

function prefixRemover(teacher) {
    return Object.assign({}, teacher, { name: unprefixName(teacher.name)});
}

function unprefixName(name) {
    let previousName;
    let newName = name;
    do {
        previousName = newName
        newName = tryRemoveSinglePrefix(previousName);
    } while (previousName != newName);

    return newName;
}

function tryRemoveSinglePrefix(name) {
    for (const prefix of PREFIXES) {
        if (name.toLowerCase().startsWith(`${prefix} `)) {
            return name.slice(prefix.length + 1);
        }
    }

    return name;
}

module.exports = {
    process
};
