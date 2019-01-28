const Client = require('sloki-node-client');
const async = require('async');

let dbName = "__bench";
let collectionName = "myCollection";
let doc = {"foo":"bar"};
let dumpTimeout;
let i;

let client = new Client("tcp://127.0.0.1:6370");

client.on('error', (err) => {
    t.fail("socket error", err);
    t.end();
});

client
    .connect()
    .then(onConnect);

function onConnect() {
    async.series([use, insert],close)
}

function close() {
    client.close();
}

function use(callback) {
    client.use(dbName, callback);
}

function dump() {
    console.log(i);
    dumpTimeout = setTimeout(dump, 1000);
}

function insert(callback) {
    console.time();
    dumpTimeout = setTimeout(dump, 1000);
    for (i = 0; i<100000; i++) {
        client.insert(collectionName, doc);
    }
    console.timeEnd();
    clearTimeout(dumpTimeout);
    callback();
}
