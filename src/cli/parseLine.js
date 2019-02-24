function extractMethod(line) {
    const e = line.match(/^[^ ]+/);
    if (!e) {
        throw new Error('method not found');
    }
    return e[0];
}

function parseLine(line) {
    const method = extractMethod(line);
    line = line.substring(method.length+1);
    const args = line;
    return {
        method,
        args
    };
}

module.exports = parseLine;
