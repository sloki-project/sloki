const log = require('evillogger')({ns:'main'});
const server = require('./src/server');

if (module === require.main) {
    server.start(() => {
        log.info("server started");
    });
}

module.exports = {
    //client:require('./src/client')
}
