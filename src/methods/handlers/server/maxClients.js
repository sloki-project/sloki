const shared = require('../../shared');
const Method = require('../../Method');

const descriptor = {
    name:'maxClients',
    categories:['server'],
    description:{
        short:'Return or set maximum number of allowed simultaneous connected clients (TCP/TLS)',
    },
    parameters:[
        {
            name:'value',
            mandatory:false,
            description:'Maximum number of allowed simultaneous connected clients (between 1 and 1000)',
            sanityCheck:{
                type:'number',
                reString:'^([1-9][0-9]{0,2}|1000)$',
                reFlag:'',
                reError:'maxClients should be a number between 1 and 1000'
            }
        }
    ]
};

function handler(params, callback) {
    if (!params) {
        callback(null, shared.ENV.NET_TCP_MAX_CLIENTS);
        return;
    }

    const maxClient = params[0];

    shared.ENV.NET_TCP_MAX_CLIENTS = parseInt(maxClient);
    callback(null, shared.ENV.NET_TCP_MAX_CLIENTS);
}

module.exports = new Method(descriptor, handler);
