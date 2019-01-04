const databases = require('./src/databases');
const tcp = require('./src/transports/tcp');
const http = require('./src/transports/http');
const log = require('evillogger')({ns:'main'});

tcp.start();

process.on('SIGINT', () => {

    log.info("SIGINT received");

    tcp.stop((err) => {
        process.exit(err ? 1 : 0);
    });

    http.stop(() => {
        process.exit(err ? 1 : 0);
    });

});
