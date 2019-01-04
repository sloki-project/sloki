const log = require('evillogger')({ns:'commands'});
const klawSync = require('klaw-sync');
const path = require('path');

let commands = {};
let cmdName;

for (file of klawSync(__dirname)) {
    if (file.path.match(/commands\/index/)) continue;
    cmdName = path.basename(file.path).replace(/\.js/,'');
    commands[cmdName] = require(file.path);
    log.info("Command %s registered", cmdName);
}

function exec(line, socket, callback) {

    let cmds = line.split(";");
    let cmd;
    let commandList = [];
    let arr;
    let command;
    let params;

    for (let i = 0; i<cmds.length; i++) {
        cmd = cmds[i].trim();
        arr = cmd.split(" ");
        command = arr.shift();
        params = arr.join(' ');

        if (!commands[command]) {
            callback(new Error(`unknow command '${command}'`));
            return;
        } else {
            commandList.push({command:command, params:params, socket:socket});
        }
    }

    for (let i = 0; i<commandList.length; i++) {
        log.info("exec %s %s", commandList[i].command, commandList[i].params);
        commands[commandList[i].command](commandList[i], callback);
    }

}


module.exports = exec;
