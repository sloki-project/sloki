const shared = require('../shared');

function list() {
    let tmp = [];
    for (db of Object.keys(shared.dbs)) {
        tmp.push(db);
    }
    return tmp;
}

module.exports = list;
