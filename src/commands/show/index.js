const log = require('evillogger')({ns:'commands:'+require('path').basename(__filename.replace(/\.js/,''))});
const ENV = require('../../env');
const databases = require('../../databases');

function show(options, callback) {

    let fnc;
    if (options.params === 'dbs' || options.params === 'databases') {
        fnc = require('./databases');
    }

    if (options.params === 'memory') {
        fnc = require('./memory');
    }

    if (fnc) {
        fnc(options, callback);
    } else {
        let error = 'missing or bad parameters (dbs|memory)';
        callback && callback(new Error(error));
    }
}

module.exports = show;
