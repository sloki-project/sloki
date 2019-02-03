const shared = require('../shared');

function list() {
    const tmp = [];
    let db;
    for (db of Object.keys(shared.dbs)) {
        tmp.push(db);
    }
    return tmp;
}

module.exports = list;
