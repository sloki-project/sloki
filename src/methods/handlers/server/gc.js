const log = require('evillogger')({ ns:'server/maxClient' });
const Method = require('../../Method');
const prettyBytes = require('pretty-bytes');
const shared = require('../../shared');
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

function handler(params, context, callback) {
    if (!global.gc) {
        const err = {
            code:shared.ERROR_CODE_PARAMETER,
            message:'garbage collector not available, please use node --expose_gc when starting sloki'
        };
        callback(err);
        return;
    }

    log.warn('running garbage collector ...');
    const before = getMem();

    global.gc();

    let i = 0;

    function wait() {
        if (config.MEM_LIMIT_REACHED && i < 60) {
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

module.exports = new Method(descriptor, handler);
