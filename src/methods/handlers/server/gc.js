const log = require('evillogger')({ ns:'server/maxClient' });
const handler = require('../../handler');
const prettyBytes = require('pretty-bytes');
const config = require('../../../config');

const descriptor = {
    title:'gc',
    description:'Force garbage collector'
};

/**
 * force garbage collector
 *
 * @example
 * > gc
 *
 * @param {object} params - not used
 * @param {function} callback - callback
 * @memberof Commands
 */

function getMem() {
    const mem = process.memoryUsage();
    return {
        rss:prettyBytes(mem.rss),
        heapTotal:prettyBytes(mem.heapTotal),
        heapUsed:prettyBytes(mem.heapUsed),
        external:prettyBytes(mem.external),
        allowed:config.MEM_LIMIT+' MB'
    };
}

function handle(params, context, callback) {
    if (!global.gc) {
        callback(handler.internalError('garbage collector not available, please use node --expose_gc when starting sloki'));
        return;
    }

    log.warn('running garbage collector ...');
    const before = getMem();

    global.gc();

    let i = 0;

    function wait() {
        if (config.MEM_LIMIT_REACHED && i < 120) {
            i++;
            setTimeout(() => {
                wait();
            }, 1000);
        } else {
            const after = getMem();
            callback(null, {
                belowMemLimit:!config.MEM_LIMIT_REACHED,
                before,
                after,
                execTime:i
            });
        }
    }

    wait();
}

module.exports = new handler.Method(descriptor, handle);
