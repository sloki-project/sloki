const log = require('evillogger')({ ns:'server/maxClient' });
const Method = require('../../Method');
const prettyBytes = require('pretty-bytes');

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
        external:prettyBytes(mem.external)
    };
}

function handler(params, session, callback) {
    if (global.gc) {
        log.warn('running garbage collector ...');
        const before = getMem();

        global.gc();

        setTimeout(() => {
            const after = getMem();
            callback(null, { called:true, before, after });
        }, 1000*5);
    } else {
        callback('garbage collector not available, please use node --expose_gc when starting sloki');
    }
}

module.exports = new Method(descriptor, handler);
