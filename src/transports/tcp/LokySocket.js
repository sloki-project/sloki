const log = require('evillogger')({ns:'transports:tcp/Socket'});
const ENV = require('../../env');
const commandExec = require('../../commands');
const version = require('../../../package.json').version;

function LokySocket(socket, pool) {

    let _eof = ENV.NET_TCP_EOF;
    let _outputFormat = ENV.NET_TCP_OUTPUT_FORMAT;
    let _prompt = ENV.NET_TCP_PROMPT;
    let _onClose;
    let _timestampSocketCreated = Date.now();
    let _quiet = false;

    let loki = {
        currentDatabase:'test'
    };

    let id  = `${socket.remoteAddress}:${socket.remotePort}`;

    _initSocketBehaviors();

    // privates

    function _commandHandler(line) {
        commandExec(line, publics, (err, result) => {
            if (err) {
                writeError(err.message);
                log.error("%s %s", id, err.message);
            }
        });
    }

    function _socketOnData(data) {
        let line = data.toString().trim();
        if (!line) {
            prompt();
            return;
        }

        log.info("%s received %s", id, line);
        _commandHandler(line);
    }

    function _socketOnClose() {
        !_quiet && ENV.NET_TCP_DEBUG && log.info("%s connection closed normaly", id);
        _onClose && _onClose(publics);
    }

    function _socketOnError(err) {
        log.error(err);
    }

    function _initSocketBehaviors() {
        socket.on("error", _socketOnError);
        socket.on("close", _socketOnClose);
        socket.on("data", _socketOnData);

        write('LockJS-Server shell version: '+version);
        write('Current database: test');
        prompt();
    }

    function _checkWriteOptions(options) {
        if (!options) {
            return;
        }

        options.end && socket.end();
        options.prompt && prompt();
    }

    // public

    function setOutputFormat(format) {
        if (format != 'json' && format !='text') {
            return new Error("Output format "+format+" not supported, try json or text");
        }
        _outputFormat = format;
    }

    function getOutputFormat() {
        return _outputFormat;
    }

    function setEof(str) {
        _eof = str;
    }

    function write(strOrData, options) {

        if (!_outputFormat || _outputFormat === 'text') {
            if (typeof strOrData === "string") {
                socket.write(strOrData+_eof);
                _checkWriteOptions(options);
            } else {
                let i = strOrData.length;
                for (let i = 0; i<strOrData.length; i++) {
                    socket.write(strOrData[i]+_eof);
                }
                prompt();
            }
            return;
        }

        if (_outputFormat === 'json') {
            socket.write(
                JSON.stringify({result:strOrData})+
                _eof
            );
            _checkWriteOptions(options);
            return;
        }

    }

    function writeError(str) {
        socket.write('ERR '+str+_eof);
        prompt();
    }

    function prompt() {
        socket.write(_prompt);
    }

    function onClose(fnc) {
        _onClose = fnc;
    }

    function end() {
        socket.end();
    }

    function getUptime() {
        return Date.now()-_timestampSocketCreated;
    }

    function setQuiet() {
        _quiet = true;
    }

    let publics = {
        loki:loki,
        id:id,
        write:write,
        writeError:writeError,
        end:end,
        prompt:prompt,
        onClose:onClose,
        pool:pool,
        setOutputFormat:setOutputFormat,
        getOutputFormat:getOutputFormat,
        getUptime:getUptime,
        setQuiet:setQuiet
    }

    return publics;

}

module.exports = LokySocket;
