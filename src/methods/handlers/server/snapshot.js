const log = require('evillogger')({ ns:'server/snapshot' });
const handler = require('../../handler');
const heapdump = require('heapdump');
const dir = require('../../../config').SLOKI_DIR;
const path = require('path');

const descriptor = {
    title:'snapshot',
    description:'take V8 snapshot'
};

/**
 * Client ask for server shutdown
 *
 * @example
 * > shutdown
 *
 * @param {object} params - not used
 * @param {function} callback - callback
 * @memberof Commands
 */
function handle(params, context, callback) {
    const filename = path.resolve(dir+'/'+Date.now() + '.heapsnapshot');
    heapdump.writeSnapshot(filename, (err, filename) => {
        log.info('dump written to', filename);
        callback(null, {
            success:true,
            filename
        });
    });
}

module.exports = new handler.Method(descriptor, handle);
