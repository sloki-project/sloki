const log = require('evillogger')({ ns:'server/reader' });
const handler = require('../../handler');

const hyperid = require('hyperid');
const uuid = hyperid(true);

const descriptor = {
    title:'reader',
    description:'Set a TCP connexion as a reader, return an id',
};

function handle(params, context, callback) {
    const uniqId = uuid();
    context.session.server.clients[context.session.id].readerId = uniqId;
    context.session.readerId = uniqId;
    log.info(`${context.session.id}: registered as a reader (${uniqId})`);
    callback(null, uniqId);
}

module.exports = new handler.Method(descriptor, handle);
