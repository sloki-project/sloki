const log = require('evillogger')({ ns:'server/maxClients' });
const handler = require('../../handler');

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

function handle(params, context, callback) {
    if (!params.value) {
        callback(null, context.server.getMaxClients());
        return;
    }

    const maxClients = params.value;

    context.server.setMaxClients(maxClients);
    log.info(`${context.session.id}: maxClients has been set to ${maxClients} for protocol ${context.server.protocol}`);
    callback(null, maxClients);
}

module.exports = new handler.Method(descriptor, handle);
