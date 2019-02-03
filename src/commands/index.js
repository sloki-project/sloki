const log = require('evillogger')({ ns:'commands' });
const klawSync = require('klaw-sync');
const path = require('path');

const commands = {};
const commandsDescriptor = {};
const reDirname = new RegExp(__dirname+'/');
const showLog = !process.mainModule.filename.match(/\/cli/);

let cmdName;
let cmdBase;

let file;
for (file of klawSync(__dirname, { depthLimit:1, nodir:true })) {

    if (file.path.match(/\/index|README|Command|regexps/)) {
        continue;
    }

    cmdName = path.basename(file.path).replace(/\.js/, '');
    cmdBase = file.path.replace(reDirname, '').replace(/\.js/, '');
    if (cmdBase.match(/\//)) {
        cmdBase = cmdBase.split('/')[0];
    }
    showLog && log.debug(`Command registered ${cmdBase}/${cmdName}`);
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
};
