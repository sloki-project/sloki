const log = require('evillogger')({ns:'commands'});
const klawSync = require('klaw-sync');
const path = require('path');

let commands = {};
let commandsDescriptor = {};
let cmdName;
let cmdBase;
let reDirname = new RegExp(__dirname+'/');
let tmp;
let showLog = !process.mainModule.filename.match(/\/cli/);

for (file of klawSync(__dirname,{depthLimit:1, nodir:true})) {

    if (file.path.match(/\/index|README|Command/)) {
        continue;
    }

    cmdName = path.basename(file.path).replace(/\.js/,'');
    cmdBase = file.path.replace(reDirname,'').replace(/\.js/,'');
    if (cmdBase.match(/\//)) {
        cmdBase = cmdBase.split('/')[0];
    }
    showLog && log.debug("Command registered (%s/%s)", cmdBase, cmdName);
    commands[cmdName] = require(file.path);
    commandsDescriptor[cmdName] = commands[cmdName].getDescriptor();
}

function getHandler(command, params, scope) {
    if (!commands[command]) {
        return;
    }

    // @TODO: optimize scope ?
    if (scope) {
        return commands[command].handle.bind(scope);
    } else {
        return commands[command].handle;
    }
}

function list() {
    return commands;
}

function listWithDescriptor() {
    return commandsDescriptor;
}


function exists(command) {
    if (commands[command]) {
        return true;
    }
    return false;
}

module.exports = {
    list,
    listWithDescriptor,
    exists,
    getHandler
}
