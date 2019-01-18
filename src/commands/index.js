const log = require('evillogger')({ns:'commands'});
const klawSync = require('klaw-sync');
const path = require('path');

let commands = {};
let cmdName;
let cmdBase;
let reDirname = new RegExp(__dirname+'/');
let tmp;

function ucFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

for (file of klawSync(__dirname,{depthLimit:1, nodir:true})) {

    if (file.path.match(/\/index|README/)) {
        // ignore myself (index.js)
        // or directories having /commands/mycommand/index.js
        continue;
    }

    cmdName = path.basename(file.path).replace(/\.js/,'');
    cmdBase = file.path.replace(reDirname,'').replace(/\.js/,'');
    if (cmdBase.match(/\//)) {
        cmdBase = cmdBase.split('/')[0];
    }
    log.info("%s Command registered (%s)", cmdBase, cmdName);
    commands[cmdName] = require(file.path);
}

function exec(command, params, callback) {
    if (!commands[command]) return callback();
    commands[command](params, callback);
}

function lookup(command) {
    return commands[command];
}

module.exports = {
    list:commands,
    exec:exec
}
