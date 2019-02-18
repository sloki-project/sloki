const log = require('evillogger')({ ns:'server/maxClient' });
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
        callback(null, config.NET_TCP_MAX_CLIENTS);
        return;
    }

    const maxClient = params.value;

    config.NET_TCP_MAX_CLIENTS = parseInt(maxClient);
    log.info(`${session.id}: TCP maxClients has been set to ${config.NET_TCP_MAX_CLIENTS}`);
    callback(null, config.NET_TCP_MAX_CLIENTS);
}

module.exports = new Method(descriptor, handler);
