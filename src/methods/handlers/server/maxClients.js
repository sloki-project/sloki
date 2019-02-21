const log = require('evillogger')({ ns:'server/maxClients' });
const Method = require('../../Method');
const config = require('../../../config');

const descriptor = {
    title:'maxClients',
    description:'Return or set maximum number of allowed simultaneous connected clients (TCP/TLS)',
    properties:{
        'value':{
            description:'Maximum number of allowed simultaneous connected clients (between 1 and 1000)',
            type:'number',
            minimum: 1,
            maximum: 1000,
        }
    }
};

function handler(params, session, callback) {
    if (!params.value) {
        callback(null, config.getMaxClients(session.engine));
        return;
    }

    const maxClients = params.value;

    config.setMaxClients(session.engine, maxClients);
    log.info(`${session.id}: maxClients has been set to ${maxClients} in engine ${session.engine}`);
    callback(null, maxClients);
}

module.exports = new Method(descriptor, handler);
