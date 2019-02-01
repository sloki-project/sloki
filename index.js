const log = require('evillogger')({ns:'main'});
const databases = require('./src/databases');
const server = require('./src/server');

if (module === require.main) {
    server.start(() => {
        log.info("server started");
    });
}

module.exports = {
    version:require('./package.json').version
}
