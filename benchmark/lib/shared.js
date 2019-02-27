const microtime = require('microtime-fast');
const argv = require('minimist')(process.argv.slice(2));

const utils = {};

utils.itemsMax = argv.max||50000;

utils.start = function(test) {
    test.dateStart = microtime.now();
    test.operationsCount = utils.itemsMax;
};

utils.stop = function(test, callback) {
    test.dateEnd = microtime.now();
    test.dateDiff = (test.dateEnd-test.dateStart)/1000/1000;
    test.timeElapsed = (test.dateEnd-test.dateStart)/1000;
    test.operationsPerSecond = Math.round(utils.itemsMax/test.dateDiff);
    if (callback) {
        callback(null, {
            operationsPerSecond:test.operationsPerSecond,
            operationsCount:test.operationsCount,
            timeElapsed:test.timeElapsed
        });
        return;
    } else {
        console.log(`${test.operationsPerSecond} ops/sec`);
    }
    return {
        operationsPerSecond:test.operationsPerSecond,
        operationsCount:test.operationsCount,
        timeElapsed:test.timeElapsed
    };
    //console.log(`Freemem after test: ${prettyBytes(os.freemem())}`);
};

utils.data = function(max) {
    const docs = [];
    let i = 0;
    let doc = {};

    if (max) utils.itemsMax = max;

    for (i=0;i<utils.itemsMax;i++) {
        doc['foo'] = 1;
        docs.push(doc);
        doc = {};
    }
    return docs;
};

utils.dataForRedis = function() {
    const docs = [];
    let i = 0;
    for (i=0;i<utils.itemsMax;i++) {
        docs.push('foo'+i);
    }
    return docs;
};

module.exports = utils;
