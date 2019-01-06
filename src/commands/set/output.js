const log = require('evillogger')({ns:'commands:'+require('path').basename(__filename.replace(/\.js/,''))});
const ENV = require('../../env');
const databases = require('../../databases');

function output(options, callback) {

    if (!options.params) {
        callback(new Error("set output <json|text>"));
        return;
    }

    err = options.socket.setOutputFormat(options.params);
    if (!err) {
        options.socket.write("output format is now '"+options.socket.getOutputFormat()+"'",{prompt:true});
    }

    callback(err);
}

module.exports = output;
