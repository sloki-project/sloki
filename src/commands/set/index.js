const path = require('path');
const log = require('evillogger')({ns:'commands:'+path.basename(__filename.replace(/\.js/,''))});
const klawSync = require('klaw-sync');
const ENV = require('../../env');

let subCommands = {};

for (let file of klawSync(__dirname,{depthLimit:0})) {

    if (file.path.match(/\/index/)) {
        // ignore myself (index.js)
        // or directories having /commands/mycommand/index.js
        continue;
    }

    let attributeName = path.basename(file.path).replace(/\.js/,'');
    subCommands[attributeName] = require(file.path);
    log.info("Command 'set %s' registered", attributeName);
}

function setter(options, callback) {

    let opts = options.params.split(' ');
    let firstParameter = opts.shift();
    options.params = opts.join(' ');
    if (subCommands[firstParameter]) {
        subCommands[firstParameter](options, callback);
        return;
    }

    let error = 'missing or bad parameters ('+Object.keys(subCommands).join('|')+')';
    callback && callback(new Error(error));
}

module.exports = setter;
