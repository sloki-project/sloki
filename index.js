const databases = require('./src/databases');
const tcp = require('./src/transports/tcp');
const http = require('./src/transports/http');
const log = require('evillogger')({ns:'main'});
const path = require('path');

let closing = false;

function start(callback) {
    tcp.start((err) => {
        if (err) {
            callback && callback(err);
            return;
        }

        http.start((err) => {
            if (err) {
                callback && callback(err);
                return;
            }

            process.on('SIGINT', () => {
                if (closing) {
                    log.info('SIGINT received, forcing exit');
                    process.exit();
                    return;
                }

                closing = true;
                log.info('SIGINT received');
                stop();
            });

            callback && callback();
        })
    });
}

function stop() {
    log.warn("shutdown in progress");
    tcp.stop((err) => {
        http.stop((err) => {
            //setTimeout(() => {
                log.info("exiting ...");
                process.exit(err ? 1 : 0);
            //},2000);
        });
    });
}

if (path.resolve(process.mainModule.filename) === path.resolve(process.cwd()+'/index.js')) {
    start();
}

module.exports = {
    start:start,
    stop:stop
}
